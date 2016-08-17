//引入依赖
var cheerio = require('cheerio'),
	superagent = require('superagent');

//请求头
var base_headers = {
		Accept: 'application/json, text/javascript, */*; q=0.01',
		'Accept-Encoding': 'gzip, deflate, br',
		'Accept-Language': 'zh-CN,zh;q=0.8',
		'Cache-Control': 'no-cache',
		Connection: 'keep-alive',
		'Content-Type':'application/json; charset=UTF-8',
		Host: 'passport.cnblogs.com',
		Origin: 'https://passport.cnblogs.com',
		Pragma: 'no-cache',
		Referer: 'https://passport.cnblogs.com/user/signin?ReturnUrl=http%3A%2F%2Fwww.cnblogs.com%2F',
		'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.2743.116 Safari/537.36',
		'X-Requested-With': 'XMLHttpRequest'
	},
	origin = 'http://www.cnblogs.com', //主网站url
	passport = 'https://passport.cnblogs.com', //用户管理url
urls = {
		origin: 'http://www.cnblogs.com/',
		do_signin: `${passport}/user/signin`, //进行登录url
		init_sigPage: `${passport}/user/signin?ReturnUrl=http%3A%2F%2Fwww.cnblogs.com%2F` //登录界面url
	},
	cookie = '',
	login_data = {}; //登陆数据

//访问登录页
function visitSigninPage() {
	return new Promise(function(fullfile, rejected) {
		superagent
			.get(urls.init_sigPage)
			.end(function(err, res) {
				if (err) rejected(err);
				else fullfile(res);
			})
	})
}

//得到token
function get_Token(text){
	var verification_token = text.match(/'VerificationToken': \'([^\"]*)\'/)[0] //token
		.split(/'VerificationToken':/g)[1]
		.split(/},/g)[0].split(/\'/)[1];

	return verification_token;
}

//登录
function doSignin(response) {
	var text = response.text,
		verification_token = get_Token(text), //token
		post_data = JSON.stringify(login_data).replace(/\s+/g,'+'); //登录数据

	return new Promise(function(fullfile, rejected) {
		superagent
			.post(urls.do_signin)
			.set(base_headers) //不写会返回{"success":false,"message":"系统检测到异常，暂不允许登录"}
			.set('Cookie', 'AspxAutoDetectCookieSupport=1') //不写会出现302 redirect 错误 
			.set('VerificationToken', verification_token) //凭证
			.type('json') //json格式传输
			.send(post_data)
			.redirects(0) //防止页面重定向
			.end(function(err, res) {
				if (err) rejected(err);
				else fullfile(res);
			})
	})
}

module.exports = function(parms, response) {
	//登录数据赋值
	login_data = parms;

	visitSigninPage()
		.then(doSignin)
		.then(function(data) {
			response.send(data.text)
		})
		.catch(function(err) {
			response.send(err)
		})
}