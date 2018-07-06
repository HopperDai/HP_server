const http = require('http');
const fs = require('fs');
const url = require('url');

const httpServer = http.createServer((req, res) => {
    const {
        pathname,
        query
    } = url.parse(req.url, true);

    // readFile 先把文件全部读取，再发送给客户端
    fs.readFile(`www${pathname}`, (err, data) => {
        if (err) {
            console.log('文件读取失败', err);

            res.writeHeader(404);
            res.write('Not Found');
        } else {
            res.write(data);
        }
        res.end();
    })
});
httpServer.listen(8080);