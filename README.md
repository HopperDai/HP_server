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

## 数据字典

1.  管理员表：

    - ID：varchar(32)；用户的 ID，由 uuid 负责生成，全局唯一；主键，非空

    - username: varchar(32)；用户名，不能重复；非空

    - password：varchar(32)；密码；非空

2.  管理员 token 表

3.  房屋表
4.  广告表
5.  友情链接表
6.  置业顾问表

## 管理后台

- 用户状态管理

- 增删改查

## RESTful 风格（请求页面资源->提交数据）

1.  按照方法

2.  按照路径

## 后台

1. 安全 -> 校验

2. 身份验证：

    a. cookie/session   理想。但不能跨域

    b. token            跨域
