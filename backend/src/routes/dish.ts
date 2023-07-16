import express from 'express'
import { createDish, getDishes } from '../controllers/dish'
import { verifyApiKey, verifyFirebaseToken } from '../middlewares/auth'

const router = express.Router()

router.get('/', verifyApiKey, verifyFirebaseToken, getDishes)
router.post('/create', verifyApiKey, verifyFirebaseToken, createDish)

export { router as dishRouter }
