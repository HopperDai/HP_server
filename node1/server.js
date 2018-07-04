const http = require('http');
const url = require('url'); // 解析 url
const querystring = require('querystring'); // 解析为键值对

const port = 8080;

const httpServer = http.createServer((req, res) => {
    // GET 数据
    const {
        pathname,
        query
    } = url.parse(req.url, true);
    console.log('接收到GET数据', pathname, query);

    // POST 数据。分段接收，数据为二进制类型
    req.on('data', data => {
        // 文本可以转换为字符串。 -> enctype = 'application/x-www-form-urlencoded'

        // 图片/文件 不能转换为字符串，需处理 -> enctype = 'multipart/form-data'
    });
    req.on('end', data => {});
});
httpServer.listen(port);