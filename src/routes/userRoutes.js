// src/routes/kapsterRoutes.js
import { Router } from 'express'
import { getUserById, updateDataUser } from '../controllers/userController'

const router = Router()

router.get('/user/:id', getUserById)
router.put('/user', updateDataUser)

export default router
