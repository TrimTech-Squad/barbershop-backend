import { Router } from 'express'
import {
  createOrder,
  updateOrder,
  requsetRefundOrder,
} from '../controllers/order'
import { auth } from '../middlewares/auth'
import { isAdmin } from '../middlewares/admin'

const router = Router()

router.post('/', auth, isAdmin, createOrder)
router.post('/notification', updateOrder)
router.post('/:id/refund', auth, isAdmin, requsetRefundOrder)

export default router
