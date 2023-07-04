import express from 'express'
import { verifyApiKey, verifyFirebaseToken } from '../middlewares/auth'
import { getUsers } from '../controllers/users'

const router = express.Router()

router.get('/', verifyApiKey, verifyFirebaseToken, getUsers)

export { router as userRouter }
