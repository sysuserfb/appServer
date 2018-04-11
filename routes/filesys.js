var express = require('express');
var path = require('path');
var app = express.Router();
var fs = require("fs");
var router = express();

var bodyParser = require('body-parser');
var multer  = require('multer');
var muilter = require('../module/multerUtil');
 
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false}));
// app.use(multer({ dest: '/package/'}).single('file'));
var urlencodedParser = bodyParser.urlencoded({ extended: false })
app.get('/index.htm', function (req, res) {
   res.send( __dirname + "/" + "index.htm" );
})
var upload=multer({dest:'package/'});
 
app.post('/Upload',muilter.single('file'),function (req, res) {
 
    console.log(req.body);
  console.log(req.file);
  res.send( __dirname + "/" + "index.htm" );
 })
  
app.post('/fileUpload', function (req, res) {
 
   console.log(req.file);  // 上传的文件信息
 
   var des_file = __dirname + "/" + req.file.originalname;
   fs.readFile( req.file.path, function (err, data) {
        fs.writeFile(des_file, data, function (err) {
         if( err ){
              console.log( err );
         }else{
               response = {
                   message:'File uploaded successfully', 
                   filename:req.file.originalname
              };
          }
          console.log( response );
          res.end( JSON.stringify( response ) );
       });
   });
})
 
app.get('/fileDownload',function(req,res){
    var package=path.resolve(__dirname,'..');
    console.log(package);
    
    res.sendFile( package+"/package/file-1523261663992.rar" );
})

var server = router.listen(8081, function () {
 
  var host = server.address().address
  var port = server.address().port
 
  console.log("应用实例，访问地址为 http://%s:%s", host, port)
 
})

module.exports = app;