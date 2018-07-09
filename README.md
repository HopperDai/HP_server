# HP_server

房产（house property）后台服务-> MIS

## 实现

1.  接口

2.  数据处理（GET/POST/FILE）

3.  身份验证（cookie/session）

## 项目

1.  数据字典
2.  接口字典

### token

- 访问服务器接口：身份识别（http 无状态）

  - cookie、session

    - cookie 不能跨域，session 不能跨域

  - token 能跨域。迫不得已，cookie 的替代品

    - token 是个好长的 id , 有服务器分配，防止别人暴力破解
