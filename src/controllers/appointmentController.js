import { object, string, date, mixed } from 'yup'
import AppointmentService from '../services/appointment'
import ResponseBuilder from '../helpers/response-builder'
import ErrorCatcher from '../helpers/error'

const appointmentSchema = object({
  kapsterId: string().required('Kapster ID harus diisi'),
  serviceId: string().required('Service ID harus diisi'),
  date: date().required('Tanggal harus diisi'),
  time: string().required('Waktu harus diisi'),
  status: mixed()
    .oneOf(['Booked', 'Completted', 'Cancelled'])
    .required('Status harus diisi'),
})

export const createAppointment = async (
  /** @type {{ body: any; }} */ req,
  /** @type {import("express").Response<any, Record<string, any>>} */ res,
) => {
  try {
    const request = req.body

    await appointmentSchema.validate(request)

    const newAppointment = await AppointmentService.createAppointment(request)

    return ResponseBuilder(
      {
        code: 201,
        data: newAppointment,
        message: 'Appointment berhasil dibuat',
      },
      res,
    )
  } catch (/** @type {any} */ error) {
    return ResponseBuilder(ErrorCatcher(error), res)
  }
}

export const getAppointmentById = async (
  /** @type {{ params: {id:string}; }} */ req,
  /** @type {import("express").Response<any, Record<string, any>>} */ res,
) => {
  try {
    const { id } = req.params
    await string().validate(id)
    const appointment = await AppointmentService.getAppointment(id)

    if (!appointment) {
      return res.status(404).json({
        error: 'Jadwal tidak ditemukan',
      })
    }

    return ResponseBuilder(
      {
        code: 200,
        data: appointment,
        message: 'Data Appointment berhasil diambil',
      },
      res,
    )
  } catch (/** @type {any} */ error) {
    return ResponseBuilder(ErrorCatcher(error), res)
  }
}

export const updateDataAppointment = async (
  /** @type {{ params: {id:string};body:any }} */ req,
  /** @type {import("express").Response<any, Record<string, any>>} */ res,
) => {
  try {
    const { id } = req.params
    await string().validate(id)
    const body = req.body

    // Validasi request menggunakan Yup
    await appointmentSchema.validate(body)

    await AppointmentService.updateAppointment(id, body)

    return ResponseBuilder(
      {
        code: 200,
        message: `Appointment dengan id ${id} berhasil diupdate`,
        data: null,
      },
      res,
    )
  } catch (/** @type {any} */ error) {
    return ResponseBuilder(ErrorCatcher(error), res)
  }
}

// export const deleteAppointment = async (
//   /** @type {{ params: {id:string}; }} */ req,
//   /** @type {import("express").Response<any, Record<string, any>>} */ res,
// ) => {
//   try {
//     const { id } = req.params
//     await string().validate(id)
//     await AppointmentService.deleteAppointment(id)

//     return ResponseBuilder(
//       {
//         code: 200,
//         message: `Appointment dengan id ${id} berhasil dihapus`,
//         data: null,
//       },
//       res,
//     )
//   } catch (/** @type {any} */ error) {
//     return ResponseBuilder(ErrorCatcher(error), res)
//   }
// }
