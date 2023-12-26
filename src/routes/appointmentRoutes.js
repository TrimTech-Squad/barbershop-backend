// src/routes/kapsterRoutes.js
import { Router } from 'express'
import {
  // createAppointment,
  getAllAppointment,
  getAppointmentById,
  getAppointmentsByUserId,
  updateDataAppointment,
} from '../controllers/appointmentController'
import { isAdmin } from '../middlewares/admin'

const router = Router()

// router.post('/', createAppointment)
router.get('/user', getAppointmentsByUserId)
router.get('/:id', getAppointmentById)
router.put('/:id', updateDataAppointment)
router.get('/', isAdmin, getAllAppointment)

export default router
