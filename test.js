var sequelize = require('./module/db');
var Sequelize = require('sequelize');
const Op = Sequelize.Op;
var { user, message, version, report, product, member } = require('./module/model');

user.hasMany(message, { as: 'sysMsg' });
message.belongsTo(user);
user.hasMany(report);
version.hasMany(report);
product.hasMany(version);
// user.belongsToMany(product, { through: member });
// product.belongsToMany(user, { through: member });
user.hasMany(member);
product.hasMany(member);
member.belongsTo(product);
member.belongsTo(user);

sequelize.sync().then(() => {//{force:true}
  console.log('------------finished');
  // [Op.or]: [{a: 5}, {a: 6}]

  var idList = "1,2";
  var li = idList.split(",");

  member.findAll({
    where: { product_id: 5 }, attributes: ['charact', 'product_id'],
    include: [{ model: user, attributes: ['id', 'user_name', 'user_email', 'user_phone', 'user_image_url'] }]
  }).then((mem) => {

    version.findAll({ where: { product_id: 5, status: ['process', 'publish'] } }).then((ver) => {
      console.log(ver);
      console.log(mem);

      var detail = {};
      detail.dev = [];
      detail.test = [];
      detail.version_cur={};
      detail.version_dev={};
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
      
    })
  })


  // member.findAll({
  //   where: { user_id: 1 }, attributes: ['charact', 'product_id'],
  //   include: [{model: product, 
  //     attributes: { exclude: ['created_at', 'updated_at'] },
  //     include: [{model:version,where:{status:"publish"},required:false,attributes:{exclude:['md5','normal_name','pack_path']}}]
  //   }]
  // }).then((mem) => {
  //   console.log(mem);
  //   var list = {};
  //   list.admin=[]
  //   list.dev =[];
  //   list.test = [];
  //   for (var i = 0; i < mem.length; i++) {
  //     if (mem[i].charact === 1) {
  //       list.admin.push(mem[i].product);
  //     } else if (mem[i].charact === 2) {
  //       list.dev.push(mem[i].product);
  //     } else if (mem[i].charact === 3) {
  //       list.test.push(mem[i].product)
  //     }
  //   }
  //   console.log(JSON.stringify(list));

  // })


});
sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });