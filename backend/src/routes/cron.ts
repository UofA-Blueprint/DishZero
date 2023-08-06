import express from 'express'
import { verifyApiKey, verifyFirebaseToken } from '../middlewares/auth'
import { getEmail } from '../controllers/email'

const router = express.Router()

router.get('/email', verifyApiKey, verifyFirebaseToken, getEmail)

export { router as cronRouter }
