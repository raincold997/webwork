//user数据库接口库
var util = require('util');
var sqlHelper = require('./sqlHelper');
var async = require('async');
var tableName = "users";
var colNames = ["userName", "password"];
var keyName = "userName";

/*
添加一个用户
 */
exports.addAUser = function (values, callback) {
    let user = null;

    async.series([function (cb) {
        //顺序执行的代码一
        sqlHelper.findNoteById(tableName, keyName, values[0],
            function (error, result) {
                if (error) throw error;
                user = result;
            },
            function (error) {
                if (error) throw cb(error, null);
                cb(null);
            });
    }, function (cb) {
        //0error,1成功添加,2已存在
        if (user === null) {
            sqlHelper.add("users", colNames, values,
                function (error) {
                    if (error) {
                        util.log('Fail on add a user:' + values[0] + 'because of error:' + error);
                        callback(error, 0);
                    }
                    else {
                        callback(null, 1);
                    }
                    cb(error);
                });
        }
        else {
            callback(null, 2);
            cb();
        }

    }], function (error, values) {
        if (error) throw error;
    });

}
/*
用户登录判断
 */
exports.loginAUser = function (values, callback) {
    let user = null;
    async.series([function (cb) {
        sqlHelper.findNoteById(tableName, keyName, values[0],
            function (error, result) {
                if (error) throw cb(error, null);
                user = result;
            },
            function (error) {
                if (error) throw cb(error, null);
                cb(null);
            });
    }, function (cb) {
        //1成功登录,2用户不存在,3密码错误
        if (user === null) {
            callback(null,2,user);
            cb();
        }
        else {
            if (user.password === values[1]) {
                callback(null, 1, user);
            }
            else {
                callback(null, 3, user);
            }
            cb();
        }
    }], function (error, values) {
        if (error) throw error;
    });

}