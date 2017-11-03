module.exports = function(request, response, controllerName) {

	this.request = request;
	this.response = response;
	this.viewPath = controllerName + "/";

	var dbClass = require("../model/DbConnect.js");
	var db = new dbClass();
	console.log("連線成功");

	function resultHandlerByJson(err, result) {
		// if (result) {
		// 	this.response.send(JSON.stringify(result));
		// }
		if (err) {
			console.log(JSON.stringify(err));
			this.response.send(JSON.stringify({rbsResult: "failure"}));
		}
		this.response.send(JSON.stringify(result));
	}

	// Param: DateStr, DateEnd, Resources[]
	this.get = function() {
		var sql = "select * from tblbooking where DateStr >= ? and DateEnd <= ? order by DateStr";
		var data = [this.request.DateStr, this.request.DateEnd];
		if (this.request.Resources) {
			sql = "select * from tblbooking where DateStr >= ? and DateEnd <= ? and Resource in (?) order by DateStr, Resource";
			data = [this.request.DateStr, this.request.DateEnd, this.request.Resources.join()];
		}
		console.log("sql: " + sql + "  \ndata: " + data);
		db.query(sql, data, resultHandlerByJson);
	}

	// Param: 
	this.getResources = function() {
		var sql = "select distinct Resource from tblbooking order by Resource";
		var data = null;
		db.query.query(sql, data, resultHandlerByJson);
	}

	// Param: Booking
	this.put = function() {
		var sql = "update tblbooking set ? where Id = ?";
		var b = this.request.Booking;
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
		var data = [this.request.NewResource, this.request.NewColor, this.request.OldResource];
		db.query(sql, data, function(err, result) {
			sql = "select * from tblbooking where DateStr >= ? and DateEnd <= ? and Resource = ? order by DateStr";
			data = [this.request.DateStr, this.request.DateEnd, this.request.NewResource];
			db.query(sql, data, resultHandlerByJson);
		});
	}

	// Param: NewBooking
	this.post = function() {
		var sql = "insert into tblbooking set ?";
		var data = [this.request.NewBooking];
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
		var data = [this.request.Id];
		db.query(sql, data, function(err, result) {
			resultHandlerByJson(err, {rbsResult: "success"});
		});
	}

	// Param: Resource
	this.deleteResource = function() {
		var sql = "delete from tblbooking where Resource = ?";
		var data = [this.request.Resource];
		db.query(sql, data, function(err, result) {
			resultHandlerByJson(err, {rbsResult: "success"});
		});
	}
}
