import { Router } from 'express'
import { register, login } from '../controllers/authController'

const router = Router()

router.post('/', login)
router.post('/register', register)

export default router