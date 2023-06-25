import express from 'express'
import { getTransactions } from '../controllers/transactions'

const router = express.Router()

router.get('/', getTransactions)

export { router as transactionsRouter }
