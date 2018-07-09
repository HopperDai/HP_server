const express = require("express");

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
    console.log(req.body);
});