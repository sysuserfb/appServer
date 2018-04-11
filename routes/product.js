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
var {addVersion,addMember,addMultiMember} = require('../module/relateTable');
var md5 = (text) => {
    return crypto.createHash('md5').update(text).digest('hex');
};

var a = (params) => {
    return 3;
}

/* GET users listing. */
router.get('/getProfile', function (req, res, next) {
    res.send('name,platform,system,member');
});

router.get('/getExperiencer', function (req, res, next) {
    res.send('respond with getExperiencer');
});

router.get('/getDeveloper', function (req, res, next) {
    res.send('respond with getDeveloper');
});
router.get('/getProductList', function (req, res, next) {
    res.send('respond with getProductList');
});

// POST
router.post('/newProduct', muilter.single('file'), function (req, res, next) {
    var form = req.body;
    var file = req.file;
    var version = '1.0.0';
    var ret;
    
    //var filemd5=md5(file.buffer);
    // console.log('file upload finished--'+filemd5);
    sequelize.transaction(function (t) {
        return product.findOrCreate({
            where: { product_name: form.product_name },
            defaults: {
                product_name: form.product_name,
                platform: form.platform,
                system: form.system
            }, transaction: t
        }).spread((prod, isCreateProd) => {
            if (isCreateProd) {
                addMember(prod,form.admin_id,{charact:1}).then(()=>{
                    addMultiMember(prod,form.dev_id,{charact:2})
                }).then(()=>{
                    addMultiMember(prod,form.test_id,{charact:3})
                });//sendMessage()
                return addVersion({
                    where: { [Op.and]: [{ product_id: prod.product_id }, { version_num: version }] }, 
                    defaults: {
                        version_num: version,
                        normal_name: prod.product_name + 'v' + version,
                        pack_path: file.path,
                        status_code: status_code.test,
                        status: status.process,
                    }, transaction: t
                }).spread((ver,isCreateVer)=>{
                    if(isCreateVer){
                        //store the package
                        return;
                    }else{
                        throw new Error('该版本已存在');
                    }
                });
            } else {
                throw new Error('产品名称不能重复');
            }
        })
    }).then((result) => {
        console.log(result);
        ret=success;
        ret.msg="产品创建成功";
    }).catch((err) => {
        console.log(err);
        ret = failed;
        ret.msg = err.message;
        res.json(ret);
    })
});

router.post('setName', function (req, res) {

});

router.post('setPlatform', function (req, res) {

});

router.post('setSystem', function (req, res) {

});

router.post('setVersion', function (req, res) {

});

router.post('addVersion', function (req, res) {

});
module.exports = router;