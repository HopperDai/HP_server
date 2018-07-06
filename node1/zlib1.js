const http = require('http');
const fs = require('fs');
const url = require('url');
const zlib = require('zlib');

const httpServer = http.createServer((req, res) => {
    const {
        pathname,
        query
    } = url.parse(req.url, true);

    let rs = fs.createReadStream(`www/${pathname}`);
    let gz = zlib.createGzip();

    res.setHeader('Content-Encoding', 'gzip'); // 重要：告诉客户端，响应的编码方式

    rs.pipe(gz).pipe(res);

    rs.on('error', err => {
        console.log('文件读取失败', err);
        res.writeHeader(404);
        res.write('Not Found');
        res.end();
    });
});
httpServer.listen(8080);