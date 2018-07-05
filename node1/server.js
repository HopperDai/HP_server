const http = require('http');
const url = require('url'); // 解析 url
const querystring = require('querystring'); // 解析为键值对
const common = require('../libs/common');
const fs = require('fs');
const uuid = require('uuid/v4'); // 唯一文件标志
const path = require('path'); // 解析文件名

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

        if (ct.startsWith('multipart/form-data')) {
            // 图片/文件 不能转换为字符串，需处理，不能破坏二进制数据 -> enctype = 'multipart/form-data'
            // multipart/form-data; boundary=xxx

            // 提取分隔符
            const spliter = '--' + ct.split('; ')[1].split('=')[1];

            // 1 用分隔符切分
            let arr = data.split(spliter);

            // 2 去除头尾
            arr.shift();
            arr.pop();

            // 3.1 去除头尾的 \r\n
            arr = arr.map(item => item.slice(2, item.length - 2));

            // 3.2 找第一个 \r\n\r\n , 切两半，前一半：信息，后一半：数据
            arr.forEach(item => {
                let n = item.indexOf('\r\n\r\n');

                let info = item.slice(0, n);
                let data = item.slice(n + 4);

                info = info.toString(); // 说明信息原本就是字符串

                if (info.indexOf('\r\n') === -1) { // 说明信息只有一行，普通数据
                    let key = common.parseInfo(info).name;
                    let val = data.toString(); // 普通数据可以转换为字符串
                } else { // 说明信息有两行，文件数据
                    const json = common.parseInfo(info);
                    const key = json.name;
                    const filename = json.filename;
                    const filepath = `upload/${uuid().replace(/\-/g,'')}${path.extname(filename)}`; // 文件路劲
                    fs.writeFile(filepath, data, err => {
                        if (err) {
                            console.log('写入失败', err);
                        } else {
                            console.log('写入成功');
                        }
                    });
                }
            })
        } else {
            // 文本可以转换为字符串。 -> enctype = 'application/x-www-form-urlencoded'

            const post_data = querystring.parse(data.toString());
            console.log('POST数据', post_data);
        }
    });
});
httpServer.listen(port);

/* 
uuidv4 产生唯一的文件名
*/