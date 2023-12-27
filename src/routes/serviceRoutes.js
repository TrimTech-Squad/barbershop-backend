import { Router } from 'express'
import {
  createService,
  getAllService,
  updateService,
  getAvailableService,
} from '../controllers/serviceController'
import { isAdmin } from '../middlewares/admin'
import { auth } from '../middlewares/auth'

const router = Router()

router.get('/', getAllService)
router.get('/:id/available', auth, isAdmin, getAvailableService)
router.post('/', auth, isAdmin, createService)
router.put('/:id', auth, isAdmin, updateService)

export default router
