var sequelize=require('./module/db');
var Sequelize = require('sequelize');
const Op = Sequelize.Op;
var {user,message,version,report,product,member}=require('./module/model');

user.hasMany(message,{as:'sysMsg'});
message.belongsTo(user);
user.hasMany(report);
version.hasMany(report);
product.hasMany(version);
user.belongsToMany(product, { through: member });
product.belongsToMany(user, { through: member });


sequelize.sync({}).then(()=>{
  console.log('------------finished');
  // [Op.or]: [{a: 5}, {a: 6}]
  var orList=[];
  var idList="1,2";
  var li=idList.split(",");
  for(var i=0;i<li.length;i++){
      orList[i]={};
      orList[i].id=li[i];
  }
  console.log(orList);
  product.findOne({where:{id:1}}).then((prod)=>{
    user.findAll({where:{id: li}}).then((list)=>{
    console.log(list);
    
    if(list.length!==0){
        return prod.addUsers(list,{through:{charact:2}});
    }
    return list;
});
  })
  
});
sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });