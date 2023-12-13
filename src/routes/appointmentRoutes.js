// src/routes/kapsterRoutes.js
import { Router } from 'express'
import {
  createAppointment,
  getAppointmentById,
  updateDataAppointment,
} from '../controllers/appointmentController'

const router = Router()

router.post('/appointment', createAppointment)
router.get('/appointment/:id', getAppointmentById)
router.put('/appointment/:id', updateDataAppointment)

export default router
