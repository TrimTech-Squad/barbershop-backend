import { Router } from 'express'
import {
  createService,
  getAllService,
  updateService,
} from '../controllers/serviceController'
import { isAdmin } from '../middlewares/admin'

const router = Router()

router.get('/', isAdmin, getAllService)
router.post('/', isAdmin, createService)
router.put('/:id', isAdmin, updateService)

export default router
