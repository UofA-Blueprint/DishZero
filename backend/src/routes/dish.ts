import express from 'express'
import { getDishes } from '../controllers/dish'

const router = express.Router()

router.get('/', getDishes)

export { router as dishRouter }
