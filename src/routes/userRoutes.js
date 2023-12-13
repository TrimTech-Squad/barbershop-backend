// src/routes/kapsterRoutes.js
import { Router } from 'express'
import { getUserById, updateDataUser } from '../controllers/userController'

const router = Router()

router.get('/:id', getUserById)
router.put('/:id', updateDataUser)

export default router
