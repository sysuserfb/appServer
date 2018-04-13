var express = require('express');
var router = express.Router();
var database = require('../module/mysql');
var muilter = require('../module/multerUtil');
var sequelize = require('../module/db');
var Sequelize = require('sequelize');
const Op = Sequelize.Op;
var { user, message, version, report, product, member } = require('../module/model');
var { success, failed, status, status_code } = require('../module/val');
var crypto = require('crypto');
var { addVersion, addMember, addMultiMember } = require('../module/relateMethod');
var md5 = (text) => {
    return crypto.createHash('md5').update(text).digest('hex');
};

var a = (params) => {
    return 3;
}

/* GET users listing. */
router.get('/getProductDetail', function (req, res, next) {
    var form = req.query;
    member.findAll({
        where: { product_id: form.product_id }, attributes: ['charact', 'product_id'],
        include: [{ model: user, 
            attributes: ['id', 'user_name', 'user_email', 'user_phone', 'user_image_url'] }]
    }).then((mem) => {
        version.findAll({ where: { product_id: form.product_id, status: ['process', 'publish'] } })
        .then((ver) => {
            var detail = {};
            detail.admin={};
            detail.dev = [];
            detail.test = [];
            detail.version_cur = {};
            detail.version_dev = {};
            for (var i = 0; i < ver.length; i++) {
                if (ver[i].status === 'publish') {
                    detail.version_cur = ver[i];
                } else if (ver[i].status === 'process') {
                    detail.version_dev = ver[i];
                }
            }
            for (var i = 0; i < mem.length; i++) {
                if (mem[i].charact === 1) {
                    detail.admin = mem[i].user;
                } else if (mem[i].charact === 2) {
                    detail.dev.push(mem[i].user);
                } else if (mem[i].charact === 3) {
                    detail.test.push(mem[i].user)
                }
            }
            console.log(detail);
            var ret=success;
            ret.msg="查询成功";
            ret.detail=detail;
            res.json(ret);
        },err=>{res.json(failed)})
    },err=>res.json(failed))
});
router.get('/getProductList', function (req, res, next) {
    var form = req.query;
    member.findAll({
        where: { user_id: form.user_id }, attributes: ['charact', 'product_id'],
        include: [{
            model: product,attributes: { exclude: ['created_at', 'updated_at'] },
            include: [{
                model: version, where: { status: "publish" },
                required: false, attributes: ['version_num']
            }]
        }]
    }).then((mem) => {

        var list = {};
        list.admin = []
        list.dev = [];
        list.test = [];
        for (var i = 0; i < mem.length; i++) {
            if (mem[i].charact === 1) {
                list.admin.push(mem[i].product);
            } else if (mem[i].charact === 2) {
                list.dev.push(mem[i].product);
            } else if (mem[i].charact === 3) {
                list.test.push(mem[i].product)
            }
        }
        var ret = success;
        ret.msg = "查询成功";
        ret.productList = list;
        res.json(ret);
    }, err => {
        var ret = failed;
        ret.msg = err;
        res.json(ret);
    });
});
// POST
router.post('/newProduct', muilter.single('file'), function (req, res, next) {
    var form = req.body;
    var file = req.file;
    console.log(file);

    var version_num = '1.0.0';
    var dev = form.dev_id.split(',');
    var test = form.test_id.split(',');
    var ret;

    //var filemd5=md5(file.buffer);
    // console.log('file upload finished--'+filemd5);
    sequelize.transaction(function (t) {
        return product.findOrCreate({
            where: { product_name: form.product_name },
            defaults: {
                product_name: form.product_name,
                platform: form.platform,
                system: form.system,
                admin_id: form.admin_id,
                admin_name: form.admin_name
            }, transaction: t
        }).spread((prod, isCreateProd) => {
            if (isCreateProd) {
                //sendMessage()
                return version.findOrCreate({
                    where: { [Op.and]: [{ product_id: prod.product_id }, { version_num: version_num }] },
                    defaults: {
                        version_num: version_num,
                        normal_name: prod.product_name + 'v' + version_num,
                        pack_path: file.path,
                        status_code: status_code.test,
                        status: status.process,
                        product_id: prod.id
                    }, transaction: t
                }).spread((ver, isCreateVer) => {
                    if (isCreateVer) {
                        var list = [{ product_id: prod.id, user_id: form.admin_id, charact: 1 }];
                        for (var i = 0; i < dev.length; i++) {
                            list.push({ product_id: prod.id, user_id: dev[i], charact: 2 });
                        }
                        for (var i = 0; i < dev.length; i++) {
                            list.push({ product_id: prod.id, user_id: test[i], charact: 3 });
                        }
                        member.bulkCreate(list)
                        return;//store the package
                    } else {
                        throw new Error('该版本已存在');
                    }
                });
            } else {
                throw new Error('产品名称不能重复');
            }
        })
    }).then((result) => {
        console.log(result + 'success');
        ret = success;
        ret.msg = "产品创建成功";
        res.json(ret);
    }).catch((err) => {
        console.log(err);
        ret = failed;
        ret.msg = err.message;
        res.json(ret);
    })
});
router.post('/deleteProduct', function (req, res) {
    var form = req.body;
    var ret;
    sequelize.transaction(function (t) {
        return product.destroy({ where: { id: form.product_id }, transaction: t })
            .then((affectRows) => {
                if (affectRows != 0) {//delete package
                    version.destroy({ where: { id: form.product_id } })
                        .then((affectRows1) => {
                            if (affectRows1 != 0) {
                                console.log('删除版本成功');
                                member.destroy({ where: { id: form.product_id } }).then((af2) => {
                                    if (af2 != 0) {
                                        console.log('删除成员成功');
                                    } else {
                                        console.log('找不到该产品的成员');
                                    }
                                });
                            } else {
                                console.log('找不到该产品的版本');
                            }
                        })
                    return;
                } else {
                    throw new Error('找不到该产品');
                }
            });
    }).then((result) => {
        console.log(result + '-----transaction success');
        ret = success;
        ret.msg = "产品删除成功";
        res.json(ret);
    }).catch((err) => {
        console.log(err);
        ret = failed;
        ret.msg = err.message;
        res.json(ret);
    })

});

router.post('/changeName', function (req, res) {
    var form = req.body;
    product.count({ where: { product_name: form.product_name } }).then(c => {
        var ret;
        if (c === 0) {
            product.update({ product_name: form.product_name },
                { where: { id: form.product_id } }).then((id) => {
                    var result;
                    if (id[0] === 0) {
                        result = failed;
                        result.msg = "修改失败，找不到该产品";
                    } else {
                        result = success;
                        result.msg = "修改名称成功";
                    }
                    res.json(result);
                })
        } else {
            ret = failed;
            ret.msg = "产品名称不能重复";
            res.json(ret);
        }
    })
});
router.post('/changeAdmin', function (req, res) {
    var form = req.body;
    product.findOne({ where: { product_id: form.product_id } }).then(prod => {
        if (prod !== null) {
            member.update({ user_id: form.user_id },
                { where: { [Op.or]: [{ charact: 1 }, { product_id: form.product_id }] } }).then((id) => {
                    var result;
                    if (id[0] === 0) {
                        result = failed;
                        result.msg = "修改失败，找不到该产品";
                    } else {
                        result = success;
                        result.msg = "修改管理员成功";
                    }
                    res.json(result);
                })
        }
    })
});

module.exports = router;