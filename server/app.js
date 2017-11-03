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
app.use(bodyParser.urlencoded({ extended: false }));

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
console.log("Server is running... Press 'Ctrl-C' button to exit.");

// 路由設定:
// 格式:  /controllerName/actionName
app.get("/", function(request, response) {
    doControllerAction("home", "index", request, response);
    console.log("http: get/ ");
});

app.get("/:controllerName", function (request, response) {
    var controllerName = request.params.controllerName;
    var actionName = "get";
    doControllerAction(controllerName, actionName, request, response);
});

app.get("/:controllerName/:actionName?", function(request, response) {
    var controllerName = request.params.controllerName;
    var actionName = "get" + request.params.actionName;
    doControllerAction(controllerName, actionName, request, response);
});

// Clinet 端送來的 POST 請求，各 controller 以 post_actionName 負責處理
// 例如: 
// 1. Client 以 GET /member/login 取得登入表單
// 2. 登入表單以 POST 傳送表單資料到 /member/login，
//    以 post_login 函式處理

app.post("/:controllerName", function (request, response) {
    var controllerName = request.params.controllerName;
    var actionName = "post";
    doControllerAction(controllerName, actionName, request, response);
});

app.post("/:controllerName/:actionName", function(request, response) {
    var controllerName = request.params.controllerName;
    var actionName = "post" + request.params.actionName;
    console.log("http: post  controller: " + controllerName + "  action: " + actionName);
    doControllerAction(controllerName, actionName, request, response);
});

app.put("/:controllerName", function (request, response) {
    var controllerName = request.params.controllerName;
    var actionName = "put";
    doControllerAction(controllerName, actionName, request, response);
});

app.put("/:controllerName/:actionName", function(request, response) {
    var controllerName = request.params.controllerName;
    var actionName = "put" + request.params.actionName;
    doControllerAction(controllerName, actionName, request, response);
});

app.delete("/:controllerName", function (request, response) {
    var controllerName = request.params.controllerName;
    var actionName = "delete";
    doControllerAction(controllerName, actionName, request, response);
});

app.delete("/:controllerName/:actionName", function(request, response) {
    var controllerName = request.params.controllerName;
    var actionName = "delete" + request.params.actionName;
    doControllerAction(controllerName, actionName, request, response);
});


// 呼叫 controller.action() 以處理 Client 端送來的請求
function doControllerAction(controllerName, actionName, request, response) {
    var moduleName = "./controller/" + controllerName + ".js";
    console.log("moduleName: " + moduleName + "  controller: " + controllerName + "  action: " + actionName);
    var controllerClass = require(moduleName);
    var controller = new controllerClass(request, response, controllerName);
    controller[actionName]();    
}