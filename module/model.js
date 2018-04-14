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
      defaultValue: 1
    }
  }, {
      defaultScope: {
        attributes: {
          exclude: ['created_at', 'updated_at', 'user_pwd', 'user_freeze', 'user_power']
        }
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
    },
    admin_id: {
      type: Sequelize.INTEGER
    },
    admin_name: {
      type: Sequelize.STRING(32)
    }
  }, {
      defaultScope: {
        attributes: {
          exclude: ['created_at', 'updated_at']
        }
      }
    }),
  member: sequelize.define('member', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    charact: {
      //1-项目管理者，2-项目开发者，3-项目测试员
      type: Sequelize.INTEGER,
      unique: "p_u_ch"
    },
    user_id: {
      type: Sequelize.INTEGER,

      unique: "p_u_ch"
    },
    product_id: {
      type: Sequelize.INTEGER,
      unique: "p_u_ch"
    }
  }, {
      defaultScope: {
        attributes: {
          exclude: ['id', 'created_at', 'updated_at']
        }
      }
    }),
  version: sequelize.define('version', {
    version_num: {
      type: Sequelize.STRING(32)
    },
    md5: {
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
  }, {
      defaultScope: {
        attributes: {
          exclude: ['md5', 'normal_name', 'pack_path']
        }
      },
      scopes: {
        detail: {
          attributes: {
            exclude: ['created_at', 'updated_at']
          }
        }
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
      type: Sequelize.BOOLEAN,
      defaultValue:0
    }
  }),
}
// export {User,ad};