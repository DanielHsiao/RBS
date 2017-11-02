// var ip = process.env.IP;
// var port = process.env.PORT;
var ip = "";
var port = 80; 

// 以 Express 建立 Web伺服器
var express = require("express");
var app = express();

// 以 body-parser 模組協助 Express 解析表單與JSON資料
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// Web伺服器的靜態檔案置於 public 資料夾
app.use(express.static("../client"));

// 以 express-session 管理狀態資訊
var session = require('express-session');
app.use(session({
	secret: 'secretKey',
	resave: false,
	saveUninitialized: true
}));

// 一切就緒，開始接受用戶端連線
app.listen(port);
console.log("Server is running... Press 'Stop' button to exit.");
