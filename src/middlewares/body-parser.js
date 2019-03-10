import queryString from 'querystring'

// 中间件处理post请求 解析请求体
export default ((req, res, next) => {
	if(req.method.toLowerCase() === 'get'){
		return next()
	}
	if(req.headers['content-type'].startsWith('multipart/form-data')){
		return next()
	}
	let data = ''
	req.on('data', chunk => {
		data += chunk
	})
	req.on('end', (chunk) => {
		// console.log(data)
		data = queryString.parse(data)
		// 给req添加一个body属性 请求体数据
		req.body = data
		// console.log(data)
		// next()一定放在这个位置，不然data获取不全就跳入下一个执行
		next()
	})
})
	

