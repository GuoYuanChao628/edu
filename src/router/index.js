import express from 'express'
import * as indexControllers from '../controllers/index.js'
const router = express.Router()

router.get('/', indexControllers.showIndex)
export default router