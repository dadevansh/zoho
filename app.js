const app                           = require('express')();
global.app                        = app;

const mysql = require('mysql');

const db = mysql.createConnection({
	host : 'localhost',
	user : 'root',
	database : 'junglepro'
});

db.connect((err) =>{
	if(err){
		throw err;
	}
	console.log('db connected');
})
global.db = db;

app.listen(3000, function () {
console.log("Started application on port", 3000)
});

require('./zoho');