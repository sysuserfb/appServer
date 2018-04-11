var { user, message, version, report, product, member } = require('../module/model');
var Sequelize = require('sequelize');
const Op = Sequelize.Op;

user.hasMany(message, { as: 'sysMsg' });
message.belongsTo(user);
user.hasMany(report);
version.hasMany(report);
product.hasMany(version);
user.belongsToMany(product, { through: member });
product.belongsToMany(user, { through: member });

module.exports = {
    addVersion(option) {
        return version.findOrCreate(option);
    },
    addMember(prod, user_id, option) {
        return user.findOne({ where: { id: user_id } }).then((auser) => {
            if (auser !== null) {
                return prod.addUser(auser, {through:option});
            }
            return auser;
        });
    },
    addMultiMember(prod, idList,option) {
        var orList=idList.split(",");
        
        return user.findAll({where:{id: orList}}).then((list)=>{
            
            if(list.length!==0){
                return prod.addUsers(list,{through:option});
            }
            return list;
        });
    },
}