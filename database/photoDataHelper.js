var util = require('util');
var sqliteHelper = require('./sqlHelper');
var async = require('async');
var keyName = "userName";
var fs = require('fs');

exports.addIntoAPhotoTable = function (userName, photoName, photoPath) {
    let tableName ="u"+userName + "_photos"
    sqliteHelper.setup(tableName, ["photoName", "photoPath"], ["VARCHAR(255)", "VARCHAR(255)"],
        function (error) {
            if (error) {
                util.log('ERROR ' + error);
                throw error;
            }
            async.series([
                    function (cb) {
                        sqliteHelper.add(tableName, ["photoName", "photoPath"], [photoName, photoPath],
                            function (error) {
                                if (error) util.log('ERROR ' + error);
                                cb(error);
                            });
                    }
                ],
                function (error, results) {
                    if (error) util.log('ERROR ' + error);
                }
            );
        });
}


exports.getUserPhotoPaths = function (userName, callback) {
    let userPhotoTableName = "u"+userName + "_photos";
    let userPhotoPaths = [];
    sqliteHelper.setup(userPhotoTableName, ["photoName", "photoPath"], ["VARCHAR(255)", "VARCHAR(255)"],
        function (error) {
            if (error) {
                util.log('ERROR ' + error);
                throw error;
            }
            async.series([
                    function (cb) {
                        sqliteHelper.forAll(userPhotoTableName, function (error, userPhoto) {
                            userPhotoPaths.push(userPhoto.photoPath);
                        }, function (error) {
                            if (error) {
                                console.log('Fail on get photoPaths because of error:' + error);
                                callback(error, null);
                                cb(error);
                            }
                            else {
                                callback(null, userPhotoPaths);
                                cb();
                            }
                        });
                    }
                ],
                function (error, results) {
                    if (error) console.log('ERROR ' + error);
                }
            );
        });


 }


exports.deleteUserPhoto = function (userName, photoPath, callback) {
    let userPhotoTableName = "u"+userName + "_photos";
    let colName = "photoPath";
    sqliteHelper.delete(userPhotoTableName, colName, photoPath, function (error) {
        if (error) {
            util.log('Fail on delete:' + error);
            callback(error);
        }
        else {
            // fs.unlinkSync(photoPath);
            callback(null);
        }
    })
}
