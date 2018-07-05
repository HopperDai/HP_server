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
    let aBuffer = [];
    req.on('data', data => {
        aBuffer.push(data);
    });
    req.on('end', () => {
        const ct = req.headers['content-type'];
        let data = Buffer.concat(aBuffer);
        console.log(ct);

        if (ct === 'application/x-www-form-urlencoded') {
            // 文本可以转换为字符串。 -> enctype = 'application/x-www-form-urlencoded'

            const post_data = querystring.parse(data.toString());
            console.log('POST数据', post_data);
        } else {
            // 图片/文件 不能转换为字符串，需处理，不能破坏二进制数据 -> enctype = 'multipart/form-data'

            console.log(data.toString());
        }


    });
});
httpServer.listen(port);