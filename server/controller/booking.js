module.exports = function(request, response, controllerName) {

	// this.request = request;
	// this.response = response;
	// this.viewPath = controllerName + "/";

	var body = request.body;

	var dbClass = require("../model/DbConnect.js");
	var db = new dbClass();
	console.log("連線成功");

	function resultHandlerByJson(err, result) {
		if (err) {
			console.log(JSON.stringify(err));
			console.log("錯誤");
			response.send(JSON.stringify({rbsResult: "failure"}));
			return;
		}
		//console.log(result);
		response.send(JSON.stringify(result));
	}



	// Param: 
	this.getResources = function() {
		var sql = "select distinct Resource, Color from tblbooking order by Resource";
		var data = null;
		var qs = db.query(sql, data, resultHandlerByJson);
	}

	// Param: NewResource, NewColor, OldResource[, DateStr, DateEnd]
	this.putResource = function() {
		var sql = "update tblbooking set Resource = ? , color = ? where Resource = ?";
		var res = body.NewResource;
		var dts = body.DateStr;
		var dte = body.DateEnd;
		var data = [body.NewResource, body.NewColor, body.OldResource];
		var qs = db.query(sql, data, function(err, result) {
			if (dts && dte) {
				sql = "select * from tblbooking where DateStr >= ? and DateEnd <= ? and Resource = ? order by DateStr";
				data = [dts, dte, res];
				db.query(sql, data, resultHandlerByJson);
			} else {
				resultHandlerByJson(err, {rbsResult: "success"});
			}
		});
	}

	// Param: Resource
	this.deleteResource = function() {
		var sql = "delete from tblbooking where Resource = ?";
		var data = [body.Resource];
		var qs = db.query(sql, data, function(err, result) {
			resultHandlerByJson(err, {rbsResult: "success"});
		});
	}




	// Param: DateStr, DateEnd, Resources[]
	this.get = function() {
		var sql = "select * from tblbooking where DateStr >= ? and DateEnd <= ? order by DateStr";
		var data = [request.query.DateStr, request.query.DateEnd];
		if (request.query.Resources) {
			var ress = request.query.Resources.map(p => `'${p}'`);
			sql = "select * from tblbooking where DateStr >= ? and DateEnd <= ? and Resource in (" + ress.join() + ") order by DateStr, Resource";
			data = [request.query.DateStr, request.query.DateEnd];
		}
		var qs = db.query(sql, data, resultHandlerByJson);
	}

	// Param: Booking
	this.put = function() {
		var sql = "update tblbooking set ? where Id = ?";
		var b = body.Booking;
		var data = [b, b.Id];
		var qs = db.query(sql, data, function(err, result) {
			if (err)
				console.log(err);
			sql = "select * from tblbooking where Id = ?"
			data = [b.Id];
			db.query(sql, data, resultHandlerByJson);
		});
	}

	// Param: Booking
	this.post = function() {
		var sql = "insert into tblbooking set ?";
		var b = body.Booking;
		delete b.Id;
		var data = [b];
		var qs = db.query(sql, data, function(err, result) {
			if (err)
				console.log(err);
			sql = "select * from tblbooking where Id = ?";
			data = [result.insertId];
			db.query(sql, data, resultHandlerByJson);
		});
	}

	// Param: Id
	this.delete = function() {
		var sql = "delete from tblbooking where Id = ?";
		var data = [body.Id];
		var qs = db.query(sql, data, function(err, result) {
			resultHandlerByJson(err, {rbsResult: "success"});
		});
	}
}
