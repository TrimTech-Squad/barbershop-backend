// src/routes/kapsterRoutes.js
import { Router } from 'express'
import {
  createAppointment,
  getAllAppointment,
  getAppointmentById,
  updateDataAppointment,
} from '../controllers/appointmentController'
import { isAdmin } from '../middlewares/admin'

const router = Router()

router.post('/', createAppointment)
router.get('/:id', getAppointmentById)
router.put('/:id', updateDataAppointment)
router.get('/', isAdmin, getAllAppointment)

export default router
