import express from 'express'
import { verifyApiKey, verifyFirebaseToken } from '../middlewares/auth'
import { updateEmailTemplate } from '../controllers/email'

const router = express.Router()

router.post('/template', verifyApiKey, verifyFirebaseToken, updateEmailTemplate)

export { router as emailRouter }
