/* 
    封装 buffer split 方法
    spliter 切分
    buffer 没有 split 操作
    buffer slice 操作截取
*/
Buffer.prototype.split = Buffer.prototype.split || function (spliter) {
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

// 解析说明信息
exports.parseInfo = function (str) {
    console.log(str);
    let arr = str.split('; ');
    let arr2 = [];
    let json = {};

    arr.forEach(item => {
        arr2 = arr2.concat(item.split('\r\n')); // 处理文件的第二行说明
    });

    arr2.forEach(item => {
        let [key, val] = item.split('=');
        if (val) {
            json[key] = val.substring(1, val.length - 1);
        } else {
            json[key] = val;
        }
    });

    return json;
}