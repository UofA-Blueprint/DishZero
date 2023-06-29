import express from 'express'
import { getDishes } from '../controllers/dish'
import { verifyApiKey } from '../middlewares/auth'

const router = express.Router()

router.get('/', verifyApiKey, getDishes)

export { router as dishRouter }
