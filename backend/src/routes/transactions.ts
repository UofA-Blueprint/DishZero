import express from 'express'
import { getTransactions } from '../controllers/transactions'
import { verifyApiKey } from '../middlewares/auth'

const router = express.Router()

router.get('/', verifyApiKey, getTransactions)

export { router as transactionsRouter }
