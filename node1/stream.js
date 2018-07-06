const fs = require('fs');

let rs = fs.createReadStream('www/1.html'); // 读取流
let ws = fs.createWriteStream('www/2.html'); // 写入流

rs.pipe(ws);

// 读取错误监听事件
rs.on('error', err => {
    console.log('读取失败', err);
});

// post 请求 req -> 读取流
rs.on('data', data => {
    console.log('读取到一块数据', data);
});

// 已经 pipe
// rs.on('end', () => {
//     console.log('读取完成');
// });

// 写入错误监听事件
ws.on('error', err => {
    console.log('写入失败', err);
});
// finish
ws.on('finish', () => {
    console.log('写入成功');
});