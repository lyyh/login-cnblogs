## 简介
#### 主要流程
1. 搭建node代理服务器。  
2. 在index.html页面上引入`https://passport.cnblogs.com/user/signin?ReturnUrl=http%3A%2F%2Fwww.cnblogs.com%2F`上的jquery.js和jsencrypt.min.js。向服务器发送getLoginData请求获取账号和密码，对它们加密，传递给服务器  
3. 服务器接收到加密后的账号和密码后，并获取登录凭证，之后向cnblogs发送登陆请求。将结果返回给index.html

#### request 请求头headers:  
cookie: 'AspxAutoDetectCookieSupport=1'
VerificationToken(凭证): (xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx)  

#### 运行方式
1. 在conf.json中修改账号和密码    
2. node app.js 或者 npm start    
3. 打开index.html,等待结果  

