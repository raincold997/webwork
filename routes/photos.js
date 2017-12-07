var express = require('express');
var router = express.Router();
var photoHandler = require('../database/photoDataHelper');
var async = require('async');
var formidable = require('formidable');
var fs = require('fs');
var TITLE = 'Add Photos';
var PHOTOS_UPLOAD_FOLDER = '/userPhoto/';
var PHOTOS_TEMP_FOLDER = '/temp/';
var PHOTOS_ABSOLUTE_FOLDER = "E:\\work\\webwork\\public\\userPhoto\\";
var domain = "http://location:30000";


router.route("/").get(function (req, res) {
    photoHandler.getUserPhotoPaths(res.locals.user.userName, function (error, userPhotoPaths) {
        if (error) {
            console.log('Fail on get photoPaths because of error:' + error);
            res.render('error', {title: 'error'});
        }
        else {
            console.log("userPathPaths:" + userPhotoPaths);
            res.render('index1', {userPhotoPaths: userPhotoPaths, title: 'photos'});
        }
    })
}).post(function (req, res) {
    let form = new formidable.IncomingForm();
    form.encoding = 'utf-8';
    form.uploadDir = 'public' + PHOTOS_TEMP_FOLDER;
    form.keepExtensions = true;
    form.maxFieldsSize = 2 * 1024 * 1024;

    form.parse(req, function (err, fields, files) {

        if (err) {
            res.locals.error = err;
            res.render('index', {title: TITLE});
            return;
        }
        console.log("The file is:");
        console.log(files);

        let extName = '';  //后缀名
        console.log(files.fulAvatar.type);
        switch (files.fulAvatar.type) {
            case 'image/pjpeg':
                extName = 'jpg';
                break;
            case 'image/jpeg':
                extName = 'jpg';
                break;
            case 'image/png':
                extName = 'png';
                break;
            case 'image/x-png':
                extName = 'png';
                break;
        }
        console.log("extName:" + extName);
        console.log("extName length:" + extName.length);

        if (extName.length == 0) {
            res.locals.error = '只支持png和jpg格式图片';
            res.render('index', {title: TITLE});
            console.log("extName done.");
            //删除缓存区的文件
            let tempPath = files.fulAvatar.path;
            fs.unlink(tempPath, function (err) {
                if (err) throw err;
                console.log('成功')
            });
        }
        else {
            let userPhotoPath = PHOTOS_UPLOAD_FOLDER + res.locals.user.userName + '/';
            let photoName = Math.random() + '.' + extName;
            let newPath = 'public' + userPhotoPath + photoName;
            let showUrl = domain + userPhotoPath + photoName;
            let userPhotoFolderPath = PHOTOS_ABSOLUTE_FOLDER + res.locals.user.userName;
            async.series([
                    function (cb) {
                        fs.exists(userPhotoFolderPath, function (exists) {
                            if (!exists) {
                                fs.mkdir(userPhotoFolderPath, function (err) {
                                    if (err)
                                        console.error(err);
                                    cb();
                                });
                            }
                            else {
                                cb();
                            }
                        });
                    },
                    function (cb) {
                        console.log("newPath", newPath);
                        fs.renameSync(files.fulAvatar.path, newPath);
                        photoHandler.addIntoAPhotoTable(res.locals.user.userName, photoName, userPhotoPath + photoName);
                        res.json({
                            "newPath": showUrl
                        });
                        cb();
                    }
                ],
                function (error, results) {
                    if (error) console.log('ERROR ' + error);
                }
            );
        }
    });

});

// router.route("/delete").post(function (req, res) {
//     let photoPath = req.body.photoPath;
//     console.log("photoPath:" + photoPath);
//     photosHandler.deleteUserPhoto(req.session.user.userName, photoPath, function (error) {
//         if (error) {
//             util.log('Fail on delete:' + error);
//         }
//     })
// });

module.exports = router;