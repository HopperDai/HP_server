const express = require("express");
const config = require("../../config");
const common = require("../../libs/common");

let router = express.Router();
module.exports = router;


// 进入所有的admin相关的页面（login除外）之前，都要校验用户身份，没登录->登录
router.use((req, res, next) => {
    if (!req.session['admin_id'] && (req.url != '/login')) { // 没登录
        res.redirect('/admin/login'); // 重定向去登录
    } else {
        next();
    }
});

// RESTful
// 登录->页面
router.get('/login', (req, res) => {
    res.render('login');
});

// 登录->数据提交
router.post('/login', (req, res) => {
    let {
        username,
        password
    } = req.body;
    console.log(username);

    // 判断两次
    if (username == config.root_username) {
        // 超级管理员
        if (common.md5(password) == config.root_password) {
            console.log('超级管理员登录成功');
            req.session['admin_id'] = '1'; // 区别其他管理员
            res.end();
        } else {
            console.log('超级管理员登录失败');
        }
    } else {
        console.log('普通管理员');
    }
});