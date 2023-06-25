import express from 'express'
import { getDishes } from '../controllers/dish'

const router = express.Router()

router.get('/all', getDishes)

export { router as dishRouter }
