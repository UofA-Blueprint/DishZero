import express from 'express'
import { verifyApiKey } from '../middlewares/auth'
import { getUsers } from '../controllers/users'

const router = express.Router()

router.get('/', verifyApiKey, getUsers)

export { router as userRouter }
