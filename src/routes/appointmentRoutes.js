// src/routes/kapsterRoutes.js
import { Router } from 'express'
import { createAppointment, getAppointmentById, updateDataAppointment, deleteAppointment } from '../controllers/appointmentController'

const router = Router();
router.post('/appointment', createAppointment)
router.get('/appointment/:id', getAppointmentById)
router.put('/appointment/:id', updateDataAppointment)
router.delete('/appointment/:id', deleteAppointment)

module.exports = router