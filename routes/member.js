var express = require('express');
var router = express.Router();
var database=require('../module/mysql');
var { user, message, version, report, product, member } = require('../module/model');
var { success, failed } = require('../module/val');

var addMember=(idArray,character)=>{

}

/* GET users listing. */
router.get('/getDeveloper', function (req, res, next) {
    res.send('respond with getDeveloper');
});

router.get('/getExperiencer', function (req, res, next) {
    res.send('respond with getExperiencer');
});

router.get('/getAdmin', function (req, res, next) {
    res.send('respond with agetAdmin');
});

router.post('/addMember', function (req, res, next) {
    
    res.send('respond with addMember');
});

router.post('/deleteMember', function (req, res, next) {
    res.send('respond with getExperiencer');
});

router.post('/changeAdmin', function (req, res, next) {
    res.send('respond with changeAdmin');
});


module.exports = router;