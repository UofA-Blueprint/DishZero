import express from 'express'
import {
    borrowDish,
    createDish,
    createMultipleDishes,
    addDishType,
    deleteDishes,
    getDishes,
    returnDish,
    updateDishCondition,
    getDishTypes,
    modifyDishStatus,
} from '../controllers/dish'
import { verifyApiKey, verifyFirebaseToken } from '../middlewares/auth'

const router = express.Router()

router.get('/', verifyApiKey, verifyFirebaseToken, getDishes)
router.get('/getDishTypes', verifyApiKey, verifyFirebaseToken, getDishTypes)
router.post('/createMultipleDishes', verifyApiKey, verifyFirebaseToken, createMultipleDishes)
router.post('/addDishType', verifyApiKey, verifyFirebaseToken, addDishType)
router.post('/modifyDishStatus', verifyApiKey, verifyFirebaseToken, modifyDishStatus)
router.post('/create', verifyApiKey, verifyFirebaseToken, createDish)
router.post('/borrow', verifyApiKey, verifyFirebaseToken, borrowDish)
router.post('/return', verifyApiKey, verifyFirebaseToken, returnDish)
router.post('/delete', verifyApiKey, verifyFirebaseToken, deleteDishes)
router.post('/condition', verifyApiKey, verifyFirebaseToken, updateDishCondition)

export { router as dishRouter }
