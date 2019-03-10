### 后台服务器的搭建

```js
const express = require('express')
const app = express()
app.get('/',(req, res) => {
    res.send('hello world');
})
app.listen(3000, () => {
    console.log('server running at http://127.0.0.1:3000');
})
```

### es6语法兼容

.babelrc文件

安装babel-preset-es12015插件并配置

```js
{
    "presets": ["es2015"]
}
```

安装babel-register  插件 处理 实时编译  import 代替 require

main.js文件配置 这样可以把服务器的import 代替 require 用 node main.js 开启服务器 一般

```js
//main.js文件
require('babel-register')
require('./app')
```

安装babel-cli实时编译插件

有了这个插件和下面的配置文件  运行npm run build 把文件转化成浏览器可用的文件

在json文件中配置

```js
 "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    //npm run dev 生产环境的方法配置
    "dev": "nodemon main.js",
    //npm start的方法配置
    "start": "nodemon main.js",
    //npm run build的方法配置 把src文件夹的文件转码的文件放在dist中
    "build": "babel src -d dist"
  },
```

import * as [config] from 'config.js'  //把config文件中的都集成于config对象中

###  Nunjuck模板

https://nunjucks.bootcss.com/

```js
// 导入nunjucks模板配置
nunjucks.configure(config.viewPath, {
    autoescape: true,
    express: app,
    // 在开发中把缓存禁用，这样代码会及时更新
    noCache: true
})
```

#### 模板的应用

建立一个基础模板layout.html  包含公共样式

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>学IT - 后台管理系统</title>
    <link rel="stylesheet" href="node_modules/bootstrap/dist/css/bootstrap.css">
    {% block style %}
    <!-- 留的预留位置 -->
    {% endblock %}
</head>
<body>
    <!-- 头部 -->
    {% include "heade.html" %}
    <!-- 主体 -->
    <div class="main">
        <!-- 侧边栏 -->
        {% include "siderbar.html" %}
        <!-- 其它页面自已调整吧 -->
        {% block body %}
        <!-- 留的预留位置 -->
        {% endblock %}
    </div>
    <script src="node_modules/jquery/dist/jquery.js"></script>
    <script src="./public/js/common.js"></script>
    {% block script %}
    <!-- 留的预留位置 -->
    {% endblock %}
</body>
</html>
```

小模块header.html

```html
<div class="header">
	<h1>头部</h1>
<div>
```

body.html

```html
<div class="body">
	<h1>主体部分</h1>
<div
```

footer.html

```html
<div class="footer">
	<h1>底部</h1>
<div
```

在使用模块的时候index.html

```html
<!-- 导入主要的基础模块 -->
{% extends "layout.html" %}

{% block style %}
<!-- 写上需要的样式 -->
{% endblock %}

{% block body %}
    <!-- 其它页面自已调整吧 -->
    <div class="container-fluid">
        添加的布局
    </div>
{% endblock %}

{% block script %}
    <script src="node_modules/echarts/dist/echarts.js"></script>
    <script>
        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('main'));

        // 指定图表的配置项和数据
        var option = {
            title: {
                text: 'ECharts 入门示例'
            },
            tooltip: {},
            legend: {
                data:['销量']
            },
            xAxis: {
                data: ["衬衫","羊毛衫","雪纺衫","裤子","高跟鞋","袜子"]
            },
            yAxis: {},
            series: [{
                name: '销量',
                type: 'bar',
                data: [5, 20, 36, 10, 10, 20]
            }]
        };
        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
    </script>
{% endblock %}
```

### express中间体的应用

```js
const express = require('express')

const app = express()

app.use((req, res, next) => {
	// console.log(1111)
	req.a = 123
     res.hello = function () {
        console.log('hello')
    }
	next()
})
app.use((req, res, next) => {
	// console.log(2222)
	req.b = 456
	next()
})
app.use((req, res, next) => {
	res.hello()
	console.log(req.a, req.b)
    // 输出结果  hello  123， 456
})
app.use((req, res, next) => {
	console.log(4444)
})

app.listen(3030, () => {
	console.log('server running at http://127.0.0.1:3030')
})
```

```js
import express from 'express'
import queryString from 'querystring'
const router = express.Router()
// export default 暴露的成员不能在定义的同时直接暴露（先定义再暴露）
export default router
router.get('/', (req, res) => {
    res.render('index.html');
})

// 中间件处理post请求
router.use((req, res, next) => {
	if(req.method.toLowerCase() === 'get' || !req.headers['content-length']){
		next()
	}
	let data = ''
	req.on('data', chunk => {
		data += chunk
	})
	req.on('end', () => {
		data = queryString.parse(data)
		// 给req添加一个body属性
		req.body = data
		// console.log(data)
		// next()一定放在这个位置，不然data获取不全就跳入下一个执行
		next()
	})

})

router.post('/advert/add', (req, res, next) => {
	res.json(req.body)
	
})

router.get('/a', (req, res, next) => {
	// console.log(req.body)
	res.json(req.body)
	
})
// 广告列表的路由
router.get('/advert/list', (req, res, next) => {
    res.render('advert_list.html')
})

```

post请求和get请求的heades的区别

get没有content-length属性，值是二进制的长度bt，可以根据这个判断是get还是post

post

```js
{ 'content-type': 'application/x-www-form-urlencoded',
  'cache-control': 'no-cache',
  'postman-token': '18ba1671-4104-4d1e-bdfa-5e5712ff01fb',
  'user-agent': 'PostmanRuntime/7.6.0',
  accept: '*/*',
  host: '127.0.0.1:3000',
  'accept-encoding': 'gzip, deflate',
  'content-length': '4',
  connection: 'keep-alive' }
```

get

```js
{ 'content-type': 'application/x-www-form-urlencoded',
  'cache-control': 'no-cache',
  'postman-token': '85b714de-234b-4a97-a5a5-1d6fd551a881',
  'user-agent': 'PostmanRuntime/7.6.0',
  accept: '*/*',
  host: '127.0.0.1:3000',
  'accept-encoding': 'gzip, deflate',
  connection: 'keep-alive' }
```

### 全局错误处理中间件

```
app.use((err, req, res, next) => {
	res.end('稍等')
})
```

### mongodb数据库

用法参考官网

```js
import express from 'express'
import queryString from 'querystring'

const MongoClient = require('mongodb').MongoClient
// const assert = require('assert')
const url = 'mongodb://localhost:27017'
const dbName = 'edu'
const router = express.Router()
// export default 暴露的成员不能在定义的同时直接暴露（先定义再暴露）
export default router
router.get('/', (req, res, next) => {
    res.render('index.html')
})
router.post('/advert/add', (req, res, next) => {
	// res.json(req.body)
	// console.log(req.body)
    //数据写入函数
	const insertDocuments = function(db, callback){
		const collection = db.collection('adverts')
		collection.insertOne(req.body, (err, result) => {
			if (err) {
				throw err
			}
			console.log(result)
		  	res.json({
		  		err_code: 0
		  	})
		})
	}
	// mongodb数据库的操作
	//数据库的链接
	MongoClient.connect(url, function(err, client) {
	  if (err) {
	  	throw err
	  }
	  console.log("Connected successfully to server");
	 
	  const db = client.db(dbName);
	//数据的写入，
	  insertDocuments(db, function(){
	  	client.close()
	  })
	})
})

router.post('/a', (req, res, next) => {
	// console.log(req.body)
	res.json(req.body)	
})
```

mongo查看数据的记录

```.cmd
> show dbs
admin   0.000GB
config  0.000GB
edu     0.000GB
local   0.000GB
test    0.000GB
> use test
switched to db test
> show collections
adverts
> db.adverts.find().pretty()
{
        "_id" : ObjectId("5c83692a74ac0426f0ad1fc7"),
        "title" : "标体",
        "image" : "1.jpg",
        "link" : "baidu.com",
        "start_time" : ISODate("12120-12-31T16:00:00Z"),
        "end_time" : ISODate("12120-12-31T16:00:00Z"),
        "create_time" : ISODate("2019-03-09T07:20:10.957Z"),
        "last_modified" : ISODate("2019-03-09T07:20:10.957Z"),
        "__v" : 0
}
>
```



### 基于mongodb的mongoose快速的数据库操作

```js
import express from 'express'
import queryString from 'querystring'
import Advert from './models/advert.js'

// const MongoClient = require('mongodb').MongoClient
// const url = 'mongodb://localhost:27017'
// const dbName = 'edu'
const router = express.Router()
// export default 暴露的成员不能在定义的同时直接暴露（先定义再暴露）
export default router
router.get('/', (req, res, next) => {
    res.render('index.html')
})
// 广告添加  post 表单的请求体
router.post('/advert/add', (req, res, next) => {
	// res.json(req.body)
	// console.log(req.body)
	// 利用mongoose 操作MongoDB数据库
	const body = req.body
	const advert = new Advert({
		// 一下内容是请求体的必备内容
		title: body.title,
		image: body.image,
		link: body.link,
		start_time: body.start_time,
		end_time: body.end_time
	})
	advert.save((err, result) => {
		if (err) {
			return next(err)
		}
		res.json({
			err_code: 0
		})
	})
})

router.post('/a', (req, res, next) => {
	// console.log(req.body)
	res.json(req.body)
	
})
// 广告列表的路由
router.get('/advert_list', (req, res, next) => {
    // res.render('advert_list.html')
    // 数据的请求
    Advert.find((err, docs) => {
	  if (err) {
	  	return next(err)
	  }
	  res.json({
	  	err_code: 0,
	  	result: docs
	  });
	})
})
// 根据id查询对应的广告
router.get('/advert_list/:advertId', (req, res, next) => {
	Advert.findById(req.params.advertId, (err, docs) => {
		if (err) {
			return next(err)
		}
		res.json({
			err_code: 0,
			result: docs
		})
	})
})
// 添加广告页面的路由
router.get('/advert_add', (req, res, next) => {
    res.render('advert_add.html')
})
```

### formidable 图片文件上传工具

- form标签添加属性[enctype="multipart/form-data"]

- 因为data: $(this).serialize(),序列化只能处理普通字符串类型，不能处理 图片，所以jquery不能提交

- ```js
  	import formidable from 'formidable'
  	var form = new formidable.IncomingForm();
      form.parse(req, function(err, fields, files) {
        // fields: 是普通字符串文本内容
        // files：是文件图片类内容
        //res.writeHead(200, {'content-type': 'text/plain'});
        //res.write('received upload:\n\n');
        //res.end(util.inspect({fields: fields, files: files}));
      });
  ```

  

