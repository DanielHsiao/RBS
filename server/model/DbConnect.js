module.exports = function() {

	this.query = function(sql, param, callback) {

		var mysql = require('mysql');

		var connection = mysql.createConnection({
			host: '127.0.0.1',
			user: 'root',
			password: '',
			database: 'rbs'
		});

		connection.connect(function(err) {
			if (err) {
				console.log(JSON.stringify(err));
				if (callback)
					callback(err);
			}
		});

		// connection.query(sql, param, callback);
		var qq = connection.query(sql, param, function(err, rows) {
			if (err) {
				console.log(JSON.stringify(err));
				if (callback)
					callback(err);
			} else {
				if (callback)
					callback(err, rows);
			}
		});

		connection.end();

		return qq.sql;
	}
}
