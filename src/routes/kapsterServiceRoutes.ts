import { Router } from 'express'

import {
  createKapsterService,
  updateKapsterService,
} from '../controllers/kapsterServiceController'
import { isAdmin } from '../middlewares/admin'

const router = Router()

router.post('/', isAdmin, createKapsterService)
router.put('/:id', isAdmin, updateKapsterService)

export default router
