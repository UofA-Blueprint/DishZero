import express from 'express'
import { verifyApiKey, verifyFirebaseToken } from '../middlewares/auth'
import { createQrCode, deleteQrCode, getQrCodes, updateQrCode } from '../controllers/qrCode'

const router = express.Router()

router.get('/', verifyApiKey, verifyFirebaseToken, getQrCodes)
router.post('/create', verifyApiKey, verifyFirebaseToken, createQrCode)
router.post('/update', verifyApiKey, verifyFirebaseToken, updateQrCode)
router.post('/delete', verifyApiKey, verifyFirebaseToken, deleteQrCode)

export { router as qrCodeRouter }
