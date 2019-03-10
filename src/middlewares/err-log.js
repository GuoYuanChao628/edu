// 定义全局错误处理 并把错误信息写进日志
const MongoClient = require('mongodb').MongoClient
// const assert = require('assert')
const url = 'mongodb://localhost:27017'
const dbName = 'edu'

export default ((errLog, req, res, next) => {
	const insertDocuments = function(db, callback){
		const collection = db.collection('errLogs')
		collection.insertOne({
			name: errLog.name,
	        message: errLog.message,
	        stack: errLog.stack,
	        time: new Date()
		}, (err, result) => {
		  	res.json({
		  		err_code: 500,
		  		message: errLog.message
		  	})
		})
	}
	// mongodb数据库的操作
	
	MongoClient.connect(url, function(err, client) {
	  console.log("Connected successfully to server");
	 
	  const db = client.db(dbName);

	  insertDocuments(db, function(){
	  	client.close()
	  })
	})
})
