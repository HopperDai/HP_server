/* 
    buffer: 二进制数据
        - 不能随便转成字符串，如果转成字符串就不能正常使用，例如：读取图片
        - 文本文件可以转字符串
*/

const fs = require('fs');

fs.readFile('a.jpg', (err, data) => {
    if (err) {
        console.log('错误', err);
    } else {
        console.log(data); // buffer 类型

        // fs.writeFile('2.jpg', data, err => {
        //     if (err) {
        //         console.log('写入错误', err);
        //     } else {
        //         console.log('写入成功')
        //     }
        // })

        // 转字符串
        // 得到的文件和原来的完全不一致 
        let str = data.toString();
        fs.writeFile('2.jpg', str, err => {
            if (err) {
                console.log('写入错误', err);
            } else {
                console.log('写入成功');
            }
        })
    }
});

// buffer 连接

const a = new Buffer('aaa');
const b = new Buffer('bbb');

const c = Buffer.concat([a, b]); // concat 方法
console.log(c); // <Buffer 61 61 61 62 62 62>