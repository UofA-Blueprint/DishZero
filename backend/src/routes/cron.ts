import express from 'express'
import { verifyApiKey, verifyFirebaseToken } from '../middlewares/auth'
import { enableEmail, getEmail, updateEmail } from '../controllers/email'

const router = express.Router()

router.get('/email', verifyApiKey, verifyFirebaseToken, getEmail)
router.post('/email/update', verifyApiKey, verifyFirebaseToken, updateEmail)
router.post('/email/enable', verifyApiKey, verifyFirebaseToken, enableEmail)

export { router as cronRouter }
