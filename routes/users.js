var express = require('express');
var router = express.Router();
var db = require('../module/mysql');
var reval=require('../module/returnval');

/* GET users listing. */
router.get('/getProfile', function (req, res, next) {
  // var sql = 'SELECT count(*) as count from user';
  // db.query(sql, function (err, result, fields) {
  //   if (err) {
  //     console.log(err);
  //     return;
  //   }
  //   console.log('用户数量 : ', result );
  //   console.log('用户数量 : ', fields );
  // });
  res.send(reval.success);
});
// router.get('/', function (req, res, next) {
//   res.send('get user homepage');
// });

router.post('/setProfile', function (req, res, next) {
  res.send('post setProfile');
});

router.post('/login', function (req, res, next) {
  res.send('post login');
});

router.post('/register', function (req, res, next) {
  res.send('post register');
});

module.exports = router;
