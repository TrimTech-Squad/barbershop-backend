// src/routes/kapsterRoutes.js
import { Router } from 'express'
import {
  createAppointment,
  getAllAppointment,
  getAppointmentById,
  updateDataAppointment,
} from '../controllers/appointmentController'

const router = Router()

router.post('/', createAppointment)
router.get('/:id', getAppointmentById)
router.put('/:id', updateDataAppointment)
router.get('/', getAllAppointment)

export default router
