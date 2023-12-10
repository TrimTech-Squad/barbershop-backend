const { createAppointment, getAppointmentById, updateDataAppointment, deleteAppointment } = require('../controllers/appointmentController')

const router = require('express').Router()

router.post('/appointment', createAppointment)
router.get('/appointment/:id', getAppointmentById)
router.put('/appointment/:id', updateDataAppointment)
router.delete('/appointment/:id', deleteAppointment)

module.exports = router