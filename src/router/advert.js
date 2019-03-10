import express from 'express'

const advertController = require('../controllers/advert.js')
const router = express.Router()
// export default 暴露的成员不能在定义的同时直接暴露（先定义再暴露）
export default router
router.get('/advert', advertController.showAdvert)
// 添加广告页面的路由
router.get('/advert/add', advertController.showAddAdvert)
// 广告列表的路由
router.get('/advert/list', advertController.showAdvertList)
// 广告添加  post 表单的请求体
router.post('/advert/add', advertController.addAdvert)

// 根据id查询对应的广告
router.get('/advert_list/:advertId', advertController.queryAdvert)
// 根据id更改广告
router.post('/advert_list/edit', advertController.editAdvert)
// 根据id 删除广告
router.get('/advert_list/delete/:advertId', advertController.deleteAdvert)