import express from 'express'
import { getTransactions } from '../controllers/transactions'
import { verifyApiKey, verifyFirebaseToken } from '../middlewares/auth'

const router = express.Router()

router.get('/', verifyApiKey, verifyFirebaseToken, getTransactions)

export { router as transactionsRouter }
