import { isAdmin } from '../middlewares/admin'

// src/routes/kapsterRoutes.js
const { Router } = require('express')
const {
  createKapster,
  getAllKapster,
  getKapsterById,
  updateKapsterData,
} = require('../controllers/kapsterController')

const router = Router()

router.get('/', isAdmin, getAllKapster)
router.post('/', isAdmin, createKapster)
router.get('/:id', getKapsterById)
router.put('/:id', isAdmin, updateKapsterData)

export default router
