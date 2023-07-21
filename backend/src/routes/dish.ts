import express from 'express'
import { createDish, getDishes, updateDishCondition } from '../controllers/dish'
import { verifyApiKey, verifyFirebaseToken } from '../middlewares/auth'

const router = express.Router()

router.get('/', verifyApiKey, verifyFirebaseToken, getDishes)
router.post('/create', verifyApiKey, verifyFirebaseToken, createDish)
router.post('/condition', verifyApiKey, verifyFirebaseToken, updateDishCondition)

export { router as dishRouter }
