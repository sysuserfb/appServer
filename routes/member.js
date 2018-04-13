var express = require('express');
var router = express.Router();
var database=require('../module/mysql');
var { user, message, version, report, product, member } = require('../module/model');
var { success, failed } = require('../module/val');

/* GET users listing. */
router.get('/getMember', function (req, res, next) {
    var form=req.query;
    
    member.findAll({where:{product_id:form.product_id,charact:form.charact},
        include:['user']}).then((mems)=>{
        var ret=success;
        ret.msg='添加成功';
        ret.memList=mems;
        res.json(ret);
    },err=>{
        var ret=failed;
        ret.msg=err;
        res.json(ret);
    })
});

router.post('/addMember', function (req, res, next) {
    var form=req.body;
    if(form.charact===1)
        res.json(failed);
    var tmp=form.user_id.split(",");
    var list=[];
    for(var i=0;i<tmp.length;i++){
        list.push({charact:form.charact,product_id:form.product_id,user_id:tmp[i]});
    }
    member.bulkCreate(list).then(()=>{
        var ret=success;
        ret.msg='添加成功';
        res.json(ret);
    },err=>{
        console.log(err);
        
        var ret=failed;
        ret.msg=err;
        res.json(ret);
    })
});

router.post('/deleteMember', function (req, res, next) {
    var form=req.body;
    var tmp=form.user_id.split(",");
    
    member.destroy({where:{charact:form.charact,product_id:form.product_id,user_id:tmp}}).then(()=>{
        var ret=success;
        ret.msg='删除成功';
        res.json(ret);
    },err=>{
        var ret=failed;
        ret.msg=err;
        res.json(ret);
    })
});
module.exports = router;