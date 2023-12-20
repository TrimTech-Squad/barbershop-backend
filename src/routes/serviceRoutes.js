import { Router } from 'express'
import {
  createService,
  getAllService,
  updateService,
  getAvailableService,
} from '../controllers/serviceController'
import { isAdmin } from '../middlewares/admin'

const router = Router()

router.get('/', isAdmin, getAllService)
router.get('/:id/available', isAdmin, getAvailableService)
router.post('/', isAdmin, createService)
router.put('/:id', isAdmin, updateService)

export default router
