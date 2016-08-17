var Server = require('./server');
	http = require('http'),
	Express = require('express'),
	bodyParser = require('body-parser')
	app = new Express(),
	conf = require('./conf.json');

//将form data数据转化成json对象
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: false
}));

app.get('/getLoginData', function(req, res) {
	res.header("Access-Control-Allow-Origin", "*");
	res.json(conf);
})

app.post('/login', function(req, res) {
	res.header("Access-Control-Allow-Origin", "*");

	if (req.body) {
		//代理登录
		Server({
			input1: req.body.ecy_acc,
			input2: req.body.ecy_pwd,
			remember: Boolean(req.body.remember)
		}, res);
	} else {
		res.json({
			success: false,
			msg: '系统错误!'
		})
	}
})

http.createServer(app).listen(8000, function(err) {
	if (err) console.log(err)
	else
		console.log('==============> Listening on port is %s', 8000);
})