const fs = require('fs');
const zlib = require('zlib');

const gz = zlib.createGzip(); // gzip 压缩格式

let rs = fs.createReadStream('www/1.html'); // 读取流
let ws = fs.createWriteStream('www/2.html.gz'); // 写入流

rs.pipe(gz).pipe(ws); // 读取 -> 压缩 -> 写入