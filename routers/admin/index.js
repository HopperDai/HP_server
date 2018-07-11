const express = require("express");
const config = require("../../config");
const common = require("../../libs/common");
const fs = require('fs');

let router = express.Router();
module.exports = router;

// 进入所有的admin相关的页面（login除外）之前，都要校验用户身份，没登录->登录
router.use((req, res, next) => {
    if (!req.session['admin_id'] && (req.path != '/login')) { // 没登录
        res.redirect(`/admin/login?ref=${req.url}`); // 重定向去登录，附带登录前访问的路径
    } else {
        req.admin_id = req.session['admin_id'];
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
            req.admin_id = req.session['admin_id'] = '1'; // 区别其他管理员
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
                        req.admin_id = req.session['admin_id'] = data[0].ID;

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
    let sql = `SELECT ID,title,position_main,tel FROM house_table`;

    req.db.query(sql, (err, data) => {
        if (err) {
            console.log(err);
            res.sendStatus(500);
        } else {
            res.render('index', {
                data
            });
        }
    });

});

// 新增
router.post('/house', (req, res) => {

    // 时间格式处理
    req.body['sale_time'] = Math.floor(new Date(req.body['sale_time']).getTime() / 1000);
    req.body['submit_time'] = Math.floor(new Date(req.body['submit_time']).getTime() / 1000);

    // 图片文件处理
    let aImg = [];
    let aRealImg = [];
    req.files.forEach(file => {
        switch (file.fieldname) {
            case 'main_img': //主图
                req.body['main_img_path'] = file.filename;
                req.body['main_img_real_path'] = file.path.replace(/\\/g, '\\\\'); // 图片路径的 \
                break;
            case 'img': //小图
                aImg.push(file.filename);
                aRealImg.push(file.path.replace(/\\/g, '\\\\'));
                break;
            case 'property_img': //户型图
                req.body['property_img_paths'] = file.filename;
                req.body['property_img_real_paths'] = file.path.replace(/\\/g, '\\\\');
                break;
        }
    });
    req.body['img_paths'] = aImg.join(','); // 多图处理
    req.body['img_real_paths'] = aRealImg.join(',');

    req.body['ID'] = common.uuid();
    req.body['admin_id'] = req.admin_id;

    let aField = [];
    let aValue = [];
    for (let name in req.body) {
        aField.push(name);
        aValue.push(req.body[name]);
    }

    let sql = `INSERT INTO house_table (${aField.join(',')}) VALUES ('${aValue.join("','")}')`;
    req.db.query(sql, err => {
        if (err) {
            console.log(err);
            res.sendStatus(500);
        } else {
            res.redirect('/admin/house');
        }
    });
});

// 删除
router.get('/house/delete', (req, res) => {
    const ID = req.query['ID'];

    let s_sql = `SELECT * FROM house_table WHERE ID='${ID}'`;

    req.db.query(s_sql, (err, data) => {
        if (err) {
            console.log(err);
            res.sendStatus(500);
        } else {
            if (data) {
                // 1.删除磁盘关联的图片
                let aRealImg = [];
                data[0].main_img_real_path && aRealImg.push(data[0].main_img_real_path); // 主图
                if (data[0].img_real_paths) {
                    data[0].img_real_paths.split(',').forEach(item => {
                        aRealImg.push(item);
                    }); // 小图
                }
                data[0].property_img_real_paths && aRealImg.push(data[0].property_img_real_paths); // 户型图
                let i = 0;

                if (aRealImg.length) {
                    unlink();
                } else {
                    deleteHouse();
                }

                function unlink() {
                    fs.unlink(aRealImg[i], err => {
                        if (err) {
                            console.log(err);
                            res.sendStatus(500);
                        } else {
                            i++;
                            if (i >= aRealImg.length) {
                                deleteHouse();
                            } else {
                                unlink();
                            }
                        }
                    });
                }

                function deleteHouse() {
                    // 2.删除数据
                    let d_sql = `DELETE FROM house_table WHERE ID='${ID}'`;
                    req.db.query(d_sql, err => {
                        if (err) {
                            console.log(err);
                            res.sendStatus(500);
                        } else {
                            res.redirect('/admin/house');
                        }
                    });
                }
            } else {
                res.sendStatus(404, 'not this data');
            }
        }
    });
});