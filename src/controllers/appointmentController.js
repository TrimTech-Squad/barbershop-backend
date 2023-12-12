const ResponseBuilder = require('../helpers/response-builder');
const AppointmentService = require('../services/appointment');
const ErrorCatcher = require('../helpers/error');
const { object, string, date, mixed } = require('yup');

const appointmentSchema = object({
  kapsterId: string().required('Kapster ID harus diisi'),
  serviceId: string().required('Service ID harus diisi'),
  date: date().required('Tanggal harus diisi'),
  time: string().required('Waktu harus diisi'),
  status: mixed().oneOf(['Customer', 'Admin']).required('Status harus diisi'),
});

const createAppointment = async (req, res) => {
  try {
    const request = req.body;

    await appointmentSchema.validate(request, { abortEarly: false });

    const newAppointment = await AppointmentService.createAppointment(request);

    return ResponseBuilder(
      {
        code: 201,
        data: newAppointment,
        message: 'Appointment berhasil dibuat',
      },
      res,
    );
  } catch (error) {
    return ResponseBuilder(ErrorCatcher(error), res);
  }
};

const getAppointmentById = async (req, res) => {
  try {
    const { id } = req.params;
    const appointment = await AppointmentService.getAppointment(id);

    if (!appointment) {
      return res.status(404).json({
        error: 'Jadwal tidak ditemukan',
      });
    }

    res.status(200).json(appointment);
  } catch (error) {
    return ResponseBuilder(ErrorCatcher(error), res);
  }
};

const updateDataAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const { kapsterId, serviceId, date, time, status } = req.body;

    // Validasi request menggunakan Yup
    await appointmentSchema.validate(
      { kapsterId, serviceId, date, time, status },
      { abortEarly: false },
    );

    const appointment = await AppointmentService.updateAppointment(id);
    if (!appointment) {
      return res.status(404).json({
        message: 'Jadwal tidak ditemukan',
      });
    }

    const updatedAppointment = await AppointmentService.updateById(id, {
      kapsterId: kapsterId || appointment.kapsterId,
      serviceId: serviceId || appointment.serviceId,
      date: date || appointment.date,
      time: time || appointment.time,
      status: status || appointment.status,
    });

    return res.status(200).json(updatedAppointment);
  } catch (error) {
    return ResponseBuilder(ErrorCatcher(error), res);
  }
};

const deleteAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const appointment = await AppointmentService.deleteAppointment(id);

    if (!appointment) {
      return res.status(404).json({ message: 'Jadwal tidak ditemukan' });
    }

    await AppointmentService.deleteById(id);

    return res.status(200).json({
      message: `Appointment dengan id ${id} berhasil dihapus`,
    });
  } catch (error) {
    return ResponseBuilder(ErrorCatcher(error), res);
  }
};

module.exports = {
  createAppointment,
  getAppointmentById,
  updateDataAppointment,
  deleteAppointment,
};
