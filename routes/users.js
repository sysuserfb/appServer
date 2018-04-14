var jsUtil = require('util');

var express = require('express');
var router = express.Router();
var db = require('../module/mysql');
var { user, message, version, report, product, member } = require('../module/model');
var { success, failed } = require('../module/val');

/* GET method */
router.get('/getProfile', function (req, res, next) {
  var form = req.query;
  user.findOne({
    where: { id: form.user_id },
    attributes: ['user_name', 'user_phone', 'user_email', 'user_image_url']
  }).then((user) => {
    var result;
    if (jsUtil.isNull(user)) {
      result = failed;
      result.msg = "用户不存在";
    } else {
      result = success;
      result.msg = "查找成功";
      result.userInfo = user;
    }
    res.json(result);
  });
});
router.get('/getUserList', function (req, res, next) {
  var form = req.query;
  user.findAll({
    attributes: [['id', 'user_id'], 'user_name', 'user_phone', 'user_email', 'user_image_url']
  }).then((userList) => {
    var result;

    result = success;
    result.msg = "查找成功";
    result.listLen = userList.length;
    result.userList = userList;

    res.json(result);
  })
});
router.get('/getMessage', function (req, res, next) {
  message.findAll({ where: { user_id: req.query.user_id } }).then((msgs) => {
    var ret = success;
    ret.msg = "获取成功";
    ret.sysMsg = msgs;
    res.json(ret);
  }, err => {
    var ret = failed;
    ret.msg = err;
    res.json()
  })
});

router.post('/submitReport', function (req, res, next) {
  var form = req.body;
  user.findById(form.user_id).then((user) => {
    user.createReport({ content: form.content, version_id: form.version_id }).then(() => {
      var result = success;
      result.msg = "提交成功";
      res.json(result);
    })

  })
});

router.post('/setProfile', function (req, res, next) {
  var form = req.body;
  user.update({
    user_name: form.user_name,
    user_email: form.email,
    user_phone: form.phoneNumber
  }, { where: { id: form.user_id } }).then((id) => {
    var result;
    if (id[0] === 0) {
      result = failed;
      result.msg = "修改失败，找不到该用户";
    } else {
      result = success;
      result.msg = "修改成功";
    }
    res.json(result);
  });
});

router.post('/login', function (req, res, next) {
  var form = req.body;
  user.findOne({
    where: {
      user_name: form.user_name,
      user_pwd: form.password,
    },
    attributes: [['id', 'user_id'], 'user_name', 'user_phone', 'user_email', 'user_image_url']
  }).then((user) => {
    var result;
    if (jsUtil.isNull(user)) {
      result = failed;
      result.msg = "用户名或密码不正确";
    } else {
      result = success;
      result.msg = "登录成功";
      result.userInfo = user;
    }
    res.json(result);
  })
});

router.post('/register', function (req, res, next) {
  var form = req.body;
  user.findOrCreate({
    where: { user_phone: form.phoneNumber },
    defaults: {
      user_name: form.userName,
      user_pwd: form.password,
      user_email: form.email
    }
  }).spread((user, created) => {
    var result;
    if (created) {
      result = success;
      result.msg = "注册成功";
      result.user_id = user.id;
    } else {
      result = failed;
      result.msg = "用户已存在";
    }
    res.json(result);
  })
});

module.exports = router;
