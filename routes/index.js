var express = require('express');
var router = express.Router();
var usersHandler = require('../database/userDataHelper')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/home', function(req, res, next) {
    res.render('index1', { title: 'home' });
});


/* GET register page. */
router.route("/registe").get(function (req, res) {    // 到达此路径则渲染register文件，并传出title值供 register.html使用
    res.render("registe", {title: 'User register'});
}).post(function (req, res) {
    // req.session.error = 'success';
    // res.send(200);
    var userName = req.body.uname;
    var password = req.body.upwd;
    usersHandler.addAUser([userName, password], function (error, addStatus) {
        if (addStatus === 0) {
            res.send(500);
            req.session.error = '网络异常错误！';
            console.log(error);
        }
        else if (addStatus === 1) {
            req.session.error = '用户名创建成功！';
            res.send(200);
        }
        else {
            req.session.error = '用户名已存在！';
            res.send(500);
        }
    });
});

router.route("/login").get(function (req,res) {
    res.render("login",{title:'User login'});
}).post(function (req,res) {
    // req.session.user = 'bob';
    // req.session.error = 'success';
    // res.send(200);
    var userName = req.body.uname;
    var password = req.body.upwd;
    //console.log(userName,password);
    // console.log("userName:"+userName);
    usersHandler.loginAUser([userName, password], function (error,loginStatus,user) {
        if (loginStatus === 1) {
            req.session.error = '登录成功！';
            req.session.user = user;
            res.send(200);
        }
        else if (loginStatus === 2) {
            req.session.error = '用户名不存在！';
            res.send(404);
        }
        else {
            req.session.error = '密码错误！';
            res.send(404);
        }
    });
});
module.exports = router;
