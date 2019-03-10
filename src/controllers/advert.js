import Advert from '../models/advert.js'
import formidable from 'formidable'
import config from '../config.js'
import moment from 'moment'
import { basename } from 'path'
module.exports = {
	showAdvert: (req, res, next) => {
		// 数据的查询
		// Advert.find((err, result) => {
		// 	if (err) {
		// 		return
		// 	}
		// 	res.render('advert_list.html', {adverts: result})
		// })
		const pageSize= 5
		const page = Number.parseInt(req.query.page, 10) || 1
		Advert
			.find()
			.skip((page - 1) * pageSize)
			.limit(pageSize)
			.exec((err, result) => {
				if (err) {
					return next(err)
				}
				Advert.count((err, count) => {
					if (err) {
						return next(err)
					}
					res.render('advert_list.html', {
						adverts: result,
						pageSize: pageSize,
						page:page,
						totalPage: Math.ceil(count / pageSize)
					})
				})
			})
	},
	// 展示广告添加页
	showAddAdvert: (req, res, next) => {
    	res.render('advert_add.html')
	},
	// 展示获取广告列表页面
	showAdvertList: (req, res, next) => {
	    // 数据的请求
	    Advert.find((err, docs) => {
		  if (err) {
		  	return next(err)
		  }
		  res.json({
		  	err_code: 0,
		  	result: docs
		  })
		})
	},
	// 添加广告
	addAdvert: (req, res, next) => {
		// res.json(req.body)
		// 利用formidable插件处理有文件的表单提交
		const form = new formidable.IncomingForm()
		// 上传的路径
		form.uploadDir = config.uploadPath
		// 保存图片的后缀名
		form.keepExtensions = true
		form.parse(req, function(err, fields, files) {
			if (err) {
				return next(err)
			}
	        // fields是普通文件字段
	        // files是文件
	        // 要把fields内容赋值给body,把files内容中的图片路径赋值给img
	        const body = fields
	        // console.log(basename(files.image.path))
	        // 利用mongoose 操作MongoDB数据库
	        body.image = basename(files.image.path)
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
	},
	// 根据id查询对应的广告
	queryAdvert: (req, res, next) => {
		Advert.findById(req.params.advertId, (err, docs) => {
			if (err) {
				return next(err)
			}
			res.json({
				err_code: 0,
				result: docs
			})
		})
	},
	// 编辑广告
	editAdvert: (req, res, next) => {
		const id = req.body.id
		const body = req.body
		Advert.update({
			_id: id
		}, {
			title: body.title,
			image: body.image,
			link: body.link,
			start_time: body.start_time,
			end_time: body.end_time
		}, (err, docs) => {
			if (err) {
				return next(err)
			}
			res.json({
				err_code: 0,
				result: docs
			})
		})
	},
	// 删除数据
	deleteAdvert: (req, res, next) => {
		// const id = req.params.advertId
		Advert.deleteOne({
			_id: req.params.advertId
		} , err => {
			if (err) {
				return next(err)
			}
			res.json({
				err_code: 0,
			})
		})
	}
}	