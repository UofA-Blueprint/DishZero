import express from 'express'
import { verifyApiKey, verifyFirebaseToken } from '../middlewares/auth'
import { updateEmailCronExpression, updateEmailTemplate } from '../controllers/cron/email'

const router = express.Router()

router.post('/template', verifyApiKey, verifyFirebaseToken, updateEmailTemplate)
router.post('/expression', verifyApiKey, verifyFirebaseToken, updateEmailCronExpression)

export { router as emailRouter }
