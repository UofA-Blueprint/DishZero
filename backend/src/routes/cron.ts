import express from 'express'
import { verifyApiKey, verifyFirebaseToken } from '../middlewares/auth'
import { enableEmail, getEmail, stopEmailCron, updateEmail, updateEmailCronExpression, updateEmailTemplate } from '../controllers/cron/email'

const router = express.Router()

router.get('/email', verifyApiKey, verifyFirebaseToken, getEmail)
router.post('/email/update', verifyApiKey, verifyFirebaseToken, updateEmail)
router.post('/email/enable', verifyApiKey, verifyFirebaseToken, enableEmail)
router.post('/email/template', verifyApiKey, verifyFirebaseToken, updateEmailTemplate)
router.post('/email/expression', verifyApiKey, verifyFirebaseToken, updateEmailCronExpression)
router.post('/email/stop', verifyApiKey, verifyFirebaseToken, stopEmailCron)

export { router as cronRouter }
