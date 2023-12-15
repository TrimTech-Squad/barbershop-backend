import { Router } from 'express'
import { createOrder, updateOrder } from '../controllers/order'
import { auth } from '../middlewares/auth'
import { isAdmin } from '../middlewares/admin'

const router = Router()

router.post('/', auth, isAdmin, createOrder)
router.post('/notification', updateOrder)

export default router
