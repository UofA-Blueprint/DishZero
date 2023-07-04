import express from 'express'
import { verifyApiKey, verifyFirebaseToken } from '../middlewares/auth'
import { getUsers, verifyUserSession } from '../controllers/users'

const router = express.Router()

router.get('/', verifyApiKey, verifyFirebaseToken, getUsers)
router.get('/session', verifyApiKey, verifyFirebaseToken, verifyUserSession)

export { router as userRouter }
