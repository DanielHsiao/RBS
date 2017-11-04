
	var dbClass = require("./model/DbConnect.js");
	var db = new dbClass();
	console.log("連線成功");

	var DateStr = "2017-11-02 09:00:00";
	var DateEnd = "2017-11-02 12:00:00";
	var b = {
		Id: 4,
		Name: "不是小組會議",
		Cont: "測試資料 04",
		Resource: "會議室 03",
		DateStr: "2017-11-03 09:00:00",
		DateEnd: "2017-11-03 12:00:00",
		Color: "#42ca8b"	
	};
	var b2 = {
		Id: 10,
		Name: "絕對是小組會議",
		DateStr: "2017-11-05 09:00:00",
		DateEnd: "2017-11-05 12:00:00",
	};

	var bn = {
		Name: "不重要會議",
		Cont: "測試資料 11",
		Resource: "會議室 08",
		DateStr: "2017-11-03 09:00:00",
		DateEnd: "2017-11-03 12:00:00",
		Color: "#ca428b"	
	};

	var sql, data;

	// sql = "select * from tblbooking where DateStr >= ? and DateEnd <= ? order by DateStr";
	// data = [DateStr, DateEnd];
	// db.query(sql, data, resultHandlerByJson);

	// sql = "select distinct Resource from tblbooking order by Resource";
	// data = null;
	// db.query(sql, data, resultHandlerByJson);

	// // sql = "update tblbooking set Name = ?, Cont = ?, Resource = ?, DateStr = ?, DateEnd = ?, Color = ? where Id = ?";
	// // data = [b.Name, b.Cont, b.Resource, b.DateStr, b.DateEnd, b.Color, b.Id];
	// // db.query(sql, data);
	// sql = "update tblbooking set ? where Id = ?";
	// data = [b2, b2.Id];
	// db.query(sql, data, function(err, result) {
	// 	sql = "select * from tblbooking where Id = ?"
	// 	data = [b2.Id];
	// 	db.query(sql, data, resultHandlerByJson);
	// });

	sql = "insert into tblbooking set ?";
	data = [bn];
	db.query(sql, data, function(err, result) {
		if (err)
			console.log(err);
		var nid = result.insertId;
		var sql = "select * from tblbooking where Id = ?";
		var data = [nid];
		db.query(sql, data, resultHandlerByJson);
	});
// 	sql = "select * from tblbooking where " + objToSqlWhere(bn);
// console.log("\r\n");
// 	console.log(sql);
// 	data = null;
// 	db.query(sql, data, resultHandlerByJson);
	// console.log(bn);
	// console.log("\r\n");
	// console.log(objToSqlWhere(bn));

	// var sql = "delete from tblbooking where Id = ?";
	// var data = [9];
	// db.query(sql, data, resultHandlerByJson);



	function resultHandlerByJson(err, rows) {
		if (rows) {
			console.log(JSON.stringify(rows));
		}
	}
