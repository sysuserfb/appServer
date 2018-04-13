var express = require('express');
var router = express.Router();
var { user, message, version, report, product, member } = require('../module/model');
var { success, failed, failret, successret, status, status_code } = require('../module/val');
var muilter = require('../module/multerUtil');
var fs = require('fs');
var path = require('path');

router.post('/newVersion', muilter.single('file'), function (req, res, next) {
    var form = req.body;
    var file = req.file;
    product.findOne({ where: { id: form.product_id } }).then((prod) => {
        if (prod != null) {
            prod.createVersion({
                version_num: form.version,
                normal_name: prod.product_name + 'v' + form.version,
                pack_path: file.path,
                status_code: status_code.test,
                status: status.process
            }).then(() => {
                res.json(successret('添加版本成功'));
            })
        } else {
            res.json(failret('找不到该产品'));
        }
    })
});
router.post('/submit2review', function (req, res, next) {
    var vid = req.body.version_id;
    version.update({ status_code: status_code.check }, { where: { id: vid } }).then((afrow) => {
        console.log(afrow);
        if (afrow != 0) {
            res.json(successret('提交成功'));
        } else {
            res.json(failret('找不到该版本'));
        }

    })
});
router.post('/reviewFailed', function (req, res, next) {
    var vid = req.body.version_id;
    version.scope('detail').findById(vid).then((v) => {
        if (v != null) {
            v.update({ status_code: status_code.f_check, status: status.failed }).then((ver) => {
                var curPath = path.resolve(__dirname, '..') + "\\" + ver.pack_path
                fs.exists(curPath, (exist) => {
                    if (exist) {
                        fs.unlinkSync(curPath);
                    }
                })
                res.json(successret('提交成功'));
            })
        } else {
            res.json(failret('找不到该版本'));
        }

    })
});
router.post('/submit2review', function (req, res, next) {
    var vid = req.body.version_id;
    version.update({ status_code: status_code.check }, { where: { id: vid } }).then((afrow) => {
        console.log(afrow);
        if (afrow != 0) {
            res.json(successret('提交成功'));
        } else {
            res.json(failret('找不到该版本'));
        }

    })
});
router.post('/publish', function (req, res, next) {
    var vid = req.body.version_id;
    version.update({ status_code: status_code.publish, status: status.publish }, { where: { id: vid } }).then((afrow) => {
        console.log(afrow);
        if (afrow != 0) {
            res.json(successret('提交成功'));
        } else {
            res.json(failret('找不到该版本'));
        }
    })
});
module.exports = router;