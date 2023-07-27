import express from 'express'
import { verifyApiKey, verifyFirebaseToken } from '../middlewares/auth'
import { createQrCode, getQrCodes } from '../controllers/qrCode'

const router = express.Router()

router.get('/', verifyApiKey, verifyFirebaseToken, getQrCodes)
router.post('/create', verifyApiKey, verifyFirebaseToken, createQrCode)

export { router as qrCodeRouter }
