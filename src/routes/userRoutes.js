// src/routes/kapsterRoutes.js
import { Router } from 'express'
import {
  getUserById,
  updateDataUser,
  updateUserPassword,
  updateUserRole,
} from '../controllers/userController'

const router = Router()

router.get('/:id', getUserById)
router.put('/', updateDataUser)
router.put('/password', updateUserPassword)
router.put('/:id/changerole', updateUserRole)

export default router
