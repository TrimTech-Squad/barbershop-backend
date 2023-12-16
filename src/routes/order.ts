import { Router } from 'express'
import {
  createOrder,
  updateOrder,
  requsetCancleOrder,
} from '../controllers/order'
import { auth } from '../middlewares/auth'
import { isAdmin } from '../middlewares/admin'

const router = Router()

router.post('/', auth, isAdmin, createOrder)
router.post('/notification', updateOrder)
router.post('/:id/cancel', auth, isAdmin, requsetCancleOrder)

export default router
