const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const mysql = require('mysql');
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
const consolidate = require('consolidate');

const config = require('./config');
const cookieKey = require('./secret/cookie_key');
const sessionKey = require('./secret/session_key');

// 搭建服务器
let server = express();
server.listen(config.port);

// 连接数据库
let db = mysql.createPool({
    host: config.mysql_host,
    port: config.mysql_port,
    user: config.mysql_user,
    password: config.mysql_password,
    database: config.mysql_database
});

// 共享 db
server.use((req, res, next) => {
    req.db = db;
    next();
});

// 中间件
// 普通 POST 数据
server.use(bodyParser.urlencoded({
    extended: false
}));

// 文件 POST 数据
let multerObj = multer({
    dest: './upload'
});
server.use(multerObj.any());

// cookie
// server.use(cookieParser(cookieKey));
// session
server.use(cookieSession({
    keys: sessionKey
}));

// 模板
server.engine('html', consolidate.ejs);
server.set('view engine', 'ejs');
server.set('views', './template');

// 处理请求
// 后台管理
server.use('/admin', require('./routers/admin'));
// 前台请求
server.use('/', require('./routers/www'));
// 静态文件请求
server.use(express.static('./www/'));