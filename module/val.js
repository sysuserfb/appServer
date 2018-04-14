module.exports = {
    success: {
        result: 0,
        msg: "success"
    },
    failed: {
        result: 1,
        msg: "failed"
    },
    failret: (msg) => {
        var ret = {
            result: 1,
            msg: "failed"
        };
        ret.msg = msg;
        return ret;
    },
    successret: (msg) => {
        var ret = {
            result: 0,
            msg: "success"
        };
        ret.msg = msg;
        return ret;
    },
    _message:{
        addAdmin:{
            title:"成员变动",
            content:"您成为了项目管理员，产品："
        },
        addDev:{
            title:"成员变动",
            content:"您成为了项目开发员，产品："
        },
        addTest:{
            title:"成员变动",
            content:"您成为了项目测试员，产品："
        }
    },
    status: {
        process: 'process',
        failed: 'failed',
        publish: 'publish'
    },
    status_code: {
        none: '0',
        f_test: '10',
        f_check: '110',
        test: '1',
        check: '11',
        publish: '111'
    },
    message: [
        {
            title: 'a'
        }
    ]
};