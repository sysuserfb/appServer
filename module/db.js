var Sequelize = require('sequelize');

module.exports = new Sequelize('pm_server', 'pm_user', '12345', {
    host: 'localhost', // 数据库地址
    dialect: 'mysql', // 指定连接的数据库类型
    pool: {
        max: 5, // 连接池中最大连接数量
        min: 0, // 连接池中最小连接数量
        idle: 10000 // 如果一个线程 10 秒钟内没有被使用过的话，那么就释放线程
    },
    define: {  
        // 字段以下划线（_）来分割（默认是驼峰命名风格）  
        'underscored': true,
        'timestamps': true,
        'charset': 'utf8',
    } 
});