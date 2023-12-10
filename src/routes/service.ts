import { Router } from 'express'
import AdminMiddlewares from '../middlewares/admin'

const router = Router()

router.get('/')
router.post('/', AdminMiddlewares.isAdmin, (_req, res) => {
  res.send('Hello World!')
})
router.put('/')

export default router
