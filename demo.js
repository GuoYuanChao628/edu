const express = require('express')

const app = express()

app.use('/', (req, res, text) => {
	try {
		const data = JSON.parse('{"name": "zs"}')
		console.log(data)
	} catch(e) {
		// statements
		console.log(e);
	}
})

app.listen(3000, () => {
	console.log('running at http://127.0.0.1:3000')
})