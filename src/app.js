// const express = require('express')
import express from 'express'
import config from './config'
import nunjucks from 'nunjucks'
import indexRouter from './router/index.js'
import advertRouter from './router/advert.js'
import queryString from 'querystring'
import bodyParser from './middlewares/body-parser.js'
import errLog from './middlewares/err-log.js'
// import {fs} from 'fs'
// import {path} from 'path'
// const fs = require('fs')
// const path = require('path')
const app = express()


// 静态托管资源
app.use('/node_modules', express.static(config.node_modules_path))
app.use('/public', express.static(config.publicPath))

// 导入nunjucks模板配置
nunjucks.configure(config.viewPath, {
    autoescape: true,
    express: app,
    noCache: true
})
// 挂载解析表单post请求体的中间件
app.use(bodyParser)

// 挂载路由
// fs.readdir(path.join(__dirname, './router'), (err, filenames) => {
// 	if (err) return 
// 	filenames.forEach( filename => {
// 		const router = require(path.join(__dirname, './router', filename))
// 		app.use(router)
// 	});
// })
app.use(indexRouter)
app.use(advertRouter)
// 全局错误处理
app.use(errLog)

app.listen(3000, () => {
    console.log('server running at http://127.0.0.1:3000');
})