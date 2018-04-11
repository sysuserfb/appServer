var Sequelize = require('sequelize');
var sequelize = require('./db');

module.exports = {
  user: sequelize.define('user', {
    user_name: {
      type: Sequelize.STRING(32)
    },
    user_pwd: {
      type: Sequelize.STRING(32)
    },
    user_phone: {
      type: Sequelize.STRING(16)
    },
    user_email: {
      type: Sequelize.STRING(32)
    },
    user_image_url: {
      type: Sequelize.STRING,
      allowNull: true
    },
    user_freeze: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    },
    user_power: {
      type: Sequelize.TINYINT(3),
      defaultValue:1
    }
  }),

  product: sequelize.define('product', {
    product_name: {
      type: Sequelize.STRING(32)
    },
    platform: {
      type: Sequelize.STRING
    },
    system: {
      type: Sequelize.STRING(32)
    }
  }),
  member: sequelize.define('member', {
  //   id: {
  //     type: Sequelize.INTEGER,
  //     primaryKey: true,
  //     autoIncrement: true
  // },
    charact: {
      //1-项目管理者，2-项目开发者，3-项目测试员
      type: Sequelize.TINYINT(3)
    }
  }),
  version: sequelize.define('version', {
    version_num: {
      type: Sequelize.STRING(32)
    },
    md5:{
      type: Sequelize.STRING(64),
      allowNull: true
    },
    normal_name: {
      // product_name + version
      type: Sequelize.STRING(64)
    },
    pack_path: {
      type: Sequelize.STRING(128)
    },
    status_code: {
      //6: [0,10,110,1,11,111]
      type: Sequelize.STRING(8)
    },
    status: {
      // process, failed , publish
      type: Sequelize.STRING(16)
    }
  }),
  report: sequelize.define('report', {
    content: {
      type: Sequelize.TEXT
    },
    feed_back: {
      type: Sequelize.STRING
    }
  }),
  message: sequelize.define('message', {
    title: {
      type: Sequelize.STRING(64)
    },
    content: {
      type: Sequelize.STRING
    },
    status: {
      //0 unread, 1 readed
      type: Sequelize.BOOLEAN
    }
  }),
}
// export {User,ad};