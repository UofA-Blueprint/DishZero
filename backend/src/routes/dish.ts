import express from 'express'
import { borrowDish, createDish, getDishes, returnDish, updateDishCondition} from '../controllers/dish'
import { verifyApiKey, verifyFirebaseToken } from '../middlewares/auth'

const router = express.Router()

router.get('/', verifyApiKey, verifyFirebaseToken, getDishes)
router.post('/create', verifyApiKey, verifyFirebaseToken, createDish)
router.post('/borrow', verifyApiKey, verifyFirebaseToken, borrowDish)
router.post('/return', verifyApiKey, verifyFirebaseToken, returnDish)
router.post('/condition', verifyApiKey, verifyFirebaseToken, updateDishCondition)

export { router as dishRouter }
