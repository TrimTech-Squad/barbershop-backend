import { isAdmin } from '../middlewares/admin'
import { auth } from '../middlewares/auth'

// src/routes/kapsterRoutes.js
const { Router } = require('express')
const {
  createKapster,
  getAllKapster,
  getKapsterById,
  updateKapsterData,
  getKapsterSchedule,
} = require('../controllers/kapsterController')

const router = Router()

router.get('/', getAllKapster)
router.post('/', auth, isAdmin, createKapster)
router.get('/:id', getKapsterById)
router.put('/:id', auth, isAdmin, updateKapsterData)
router.get('/:id/schedules', getKapsterSchedule)

export default router
