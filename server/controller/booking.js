module.exports = function(request, response, controllerName) {

	this.request = request;
	this.response = response;
	this.viewPath = controllerName + "/";
	this.body = this.request.body;

	var dbClass = require("../model/DbConnect.js");
	var db = new dbClass();
	console.log("連線成功");

	function resultHandlerByJson(err, result) {
		var objResponse = response;
		// if (result) {
		// 	objResponse.send(JSON.stringify(result));
		// }
		if (err) {
			console.log(JSON.stringify(err));
			console.log("錯誤");
			objResponse.send(JSON.stringify({rbsResult: "failure"}));
			return;
		}
		objResponse.send(JSON.stringify(result));
	}

	// Param: DateStr, DateEnd, Resources[]
	this.get = function() {
		var sql = "select * from tblbooking where DateStr >= ? and DateEnd <= ? order by DateStr";
		var data = [this.request.query.DateStr, this.request.query.DateEnd];
		if (this.request.query.Resources) {
			sql = "select * from tblbooking where DateStr >= ? and DateEnd <= ? and Resource in (?) order by DateStr, Resource";
			data = [this.request.query.DateStr, this.request.query.DateEnd, this.request.query.Resources.join()];
		}
		console.log("sql: " + sql + "  \ndata: " + data);
		console.log("\nResources: " + this.request.query.Resources);
		db.query(sql, data, resultHandlerByJson);
	}

	// Param: 
	this.getResources = function() {
		var sql = "select distinct Resource, Color from tblbooking order by Resource";
		var data = null;
		db.query(sql, data, resultHandlerByJson);
	}

	// Param: Booking
	this.put = function() {
		var sql = "update tblbooking set ? where Id = ?";
		var b = this.body.Booking;
		var data = [b, b.Id];
		db.query(sql, data, function(err, result) {
			sql = "select * from tblbooking where Id = ?"
			data = [b.Id];
			db.query(sql, data, resultHandlerByJson);
		});
	}

	// Param: NewResource, NewColor, OldResource, DateStr, DateEnd
	this.putResource = function() {
		var sql = "update tblbooking set Resource = ? , color = ? where Resource = ?";
		var data = [this.body.NewResource, this.body.NewColor, this.body.OldResource];
		db.query(sql, data, function(err, result) {
			sql = "select * from tblbooking where DateStr >= ? and DateEnd <= ? and Resource = ? order by DateStr";
			data = [this.body.DateStr, this.body.DateEnd, this.body.NewResource];
			db.query(sql, data, resultHandlerByJson);
		});
	}

	// Param: NewBooking
	this.post = function() {
		var sql = "insert into tblbooking set ?";
		var data = [this.body.NewBooking];
		db.query(sql, data, function(err, result) {
			if (err)
				console.log(err);
			var sql = "select * from tblbooking where Id = ?";
			var data = [result.insertId];
			db.query(sql, data, resultHandlerByJson);
		});
	}

	// Param: Id
	this.delete = function() {
		var sql = "delete from tblbooking where Id = ?";
		var data = [this.body.Id];
		db.query(sql, data, function(err, result) {
			resultHandlerByJson(err, {rbsResult: "success"});
		});
	}

	// Param: Resource
	this.deleteResource = function() {
		var sql = "delete from tblbooking where Resource = ?";
		var data = [this.body.Resource];
		console.log("debug - data: " + data + " sql = " + sql);
		db.query(sql, data, function(err, result) {
			resultHandlerByJson(err, {rbsResult: "success"});
		});
	}
}