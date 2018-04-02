var express = require('express');
var router = express.Router();
var database=require('../module/mysql');

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

// POST
router.post('/createProduct', function (req, res, next) {
    res.send('respond with createProduct');
});

router.post('setName',function(req,res){

});

router.post('setPlatform',function(req,res){

});

router.post('setSystem',function(req,res){

});

router.post('setVersion',function(req,res){

});

router.post('addVersion',function(req,res){

});
module.exports = router;