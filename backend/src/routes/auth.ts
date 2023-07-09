import express from 'express'
import { verifyApiKey, verifyFirebaseToken } from '../middlewares/auth'
import { login, logout } from '../controllers/auth'

const router = express.Router()

router.post('/login', verifyApiKey, login)
router.post('/logout', verifyApiKey, logout)

export { router as authRouter }
