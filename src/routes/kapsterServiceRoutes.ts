import { Router } from 'express'

import {
  createKapsterService,
  updateKapsterService,
  getKapsterServices,
} from '../controllers/kapsterServiceController'
import { isAdmin } from '../middlewares/admin'

const router = Router()

router.get('/', getKapsterServices)
router.post('/', isAdmin, createKapsterService)
router.put('/:id', isAdmin, updateKapsterService)

export default router
