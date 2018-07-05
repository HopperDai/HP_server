/* 
    封装 buffer split 方法
    spliter 切分
    buffer 没有 split 操作
    buffer slice 操作截取
*/
Buffer.prototype.splite = Buffer.prototype.splite || function (spliter) {
    let b = this;

    let result = [];
    let n;

    while ((n = b.indexOf(spliter)) != -1) {
        let res1 = b.slice(0, n);
        let res2 = b.slice(n + spliter.length);

        result.push(res1);
        b = res2;
    }

    result.push(b);
    return result;
}

// let b = new Buffer('aaaaaadfdfd===ddddafijao==ddd===dddfafa');
// console.log(b.splite('==='));