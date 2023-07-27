import express from 'express'
import { verifyApiKey, verifyFirebaseToken } from '../middlewares/auth'
import { createQrCode, getQrCodes, updateQrCode } from '../controllers/qrCode'

const router = express.Router()

router.get('/', verifyApiKey, verifyFirebaseToken, getQrCodes)
router.post('/create', verifyApiKey, verifyFirebaseToken, createQrCode)
router.post('/update', verifyApiKey, verifyFirebaseToken, updateQrCode)

export { router as qrCodeRouter }
