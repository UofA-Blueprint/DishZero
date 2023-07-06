import express from 'express'
import { getDishes } from '../controllers/dish'
import { verifyApiKey, verifyFirebaseToken } from '../middlewares/auth'

const router = express.Router()

router.get('/', verifyApiKey, verifyFirebaseToken, getDishes)

export { router as dishRouter }
