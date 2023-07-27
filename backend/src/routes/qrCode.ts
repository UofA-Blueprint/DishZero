import express from 'express'
import { verifyApiKey, verifyFirebaseToken } from '../middlewares/auth'
import { getQrCodes } from '../controllers/qrCode'

const router = express.Router()

router.get('/', verifyApiKey, verifyFirebaseToken, getQrCodes)

export { router as qrCodeRouter }
