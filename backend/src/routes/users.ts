import express from 'express'
import { verifyApiKey, verifyFirebaseToken } from '../middlewares/auth'
import { getUsers, updateUser, verifyUserSession } from '../controllers/users'

const router = express.Router()

router.get('/', verifyApiKey, verifyFirebaseToken, getUsers)
router.get('/session', verifyApiKey, verifyFirebaseToken, verifyUserSession)
router.post('/modify/:type', verifyApiKey, verifyFirebaseToken, updateUser)

export { router as userRouter }
