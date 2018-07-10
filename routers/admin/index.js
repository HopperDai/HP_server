const express = require("express");
const config = require("../../config");
const common = require("../../libs/common");

let router = express.Router();
module.exports = router;


// 进入所有的admin相关的页面（login除外）之前，都要校验用户身份，没登录->登录
router.use((req, res, next) => {
    if (!req.session['admin_id'] && (req.path != '/login')) { // 没登录
        res.redirect(`/admin/login?ref=${req.url}`); // 重定向去登录，附带登录前访问的路径
    } else {
        next();
    }
});

// RESTful
// 登录->页面
router.get('/login', (req, res) => {
    res.render('login', {
        err: '',
        ref: req.query['ref'] || ''
    });
});

// 登录->数据提交
router.post('/login', (req, res) => {
    let {
        username,
        password
    } = req.body;

    // 判断两次
    if (username == config.root_username) {
        // 超级管理员
        if (common.md5(password) == config.root_password) {
            console.log('超级管理员登录成功');
            req.session['admin_id'] = '1'; // 区别其他管理员
            let ref = req.query['ref'] || ''; // 重定向回原来的访问地址
            res.redirect(`/admin${ref}`);
        } else {
            console.log('超级管理员登录失败');
            showErr('用户或密码错误');
        }
    } else {
        // 普通管理员
        let sql = `SELECT ID,password FROM admin_table WHERE username='${username}'`;

        req.db.query(sql, (err, data) => {
            if (err) {
                console.log('数据库错误', err);
                showErr('数据库错误');
            } else {
                // 判断用户是否存在
                if (data.length) {
                    if (data[0].password == common.md5(password)) {
                        req.session['admin_id'] = data[0].ID;

                        let ref = req.query['ref'] || ''; // 重定向回原来的访问地址
                        res.redirect(`/admin${ref}`); // 登录成功。
                    } else {
                        showErr('用户或密码错误');
                    }
                } else {
                    console.log('用户不存在');
                    showErr('用户名或密码错误');
                }
            }
        })
    }

    function showErr(err) {
        res.render('login', {
            err,
            ref: req.query['ref'] || ''
        });
    }
});

// admin 的根 -> house
router.get('/', (req, res) => {
    res.redirect('/admin/house');
});

router.get('/house', (req, res) => {
    res.render('index');
});

router.post('/house', (req, res) => {
    console.log(req.body);
    res.end();
});