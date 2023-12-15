import { Router } from 'express'
import { createOrder } from '../controllers/order'
import { auth } from '../middlewares/auth'
import { isAdmin } from '../middlewares/admin'

const router = Router()

router.post('/', auth, isAdmin, createOrder)

export default router
