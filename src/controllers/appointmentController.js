import { mixed, string } from 'yup'
import AppointmentService from '../services/appointment'
import ResponseBuilder from '../helpers/response-builder'
import ErrorCatcher, { UnauthorizedError } from '../helpers/error'

// const appointmentSchema = object({
//   userId: string().required('User ID harus diisi'),
//   kapsterId: string().required('Kapster ID harus diisi'),
//   serviceId: string().required('Service ID harus diisi'),
//   time: string().required('Waktu harus diisi'),
// })

// export const createAppointment = async (
//   /** @type {{ body: any; }} */ req,
//   /** @type {import("express").Response<any, Record<string, any>>} */ res,
// ) => {
//   try {
//     if (res.locals.isAdmin)
//       throw new UnauthorizedError(
//         'Anda tidak memiliki akses untuk membuat appointment',
//       )

//     const request = req.body
//     request.userId = res.locals.user.id
//     await appointmentSchema.validate(request)
//     const newAppointment = await AppointmentService.createAppointment(request)

//     return ResponseBuilder(
//       {
//         code: 201,
//         data: newAppointment,
//         message: 'Appointment berhasil dibuat',
//       },
//       res,
//     )
//   } catch (/** @type {any} */ error) {
//     return ResponseBuilder(ErrorCatcher(error), res)
//   }
// }

export const getAppointmentById = async (
  /** @type {{ params: {id:string}; }} */ req,
  /** @type {import("express").Response<any, Record<string, any>>} */ res,
) => {
  try {
    const { id } = req.params
    await string().validate(id)
    const appointment = await AppointmentService.getAppointment(
      id,
      res.locals.user.id,
    )

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
    const body = { status: req.body.status, time: req.body.time }

    // Validasi request menggunakan Yup
    await mixed()
      .oneOf(['Booked', 'Completed', 'Cancelled'])
      .required('Status harus diisi')
      .validate(body.status)
    await string().required('Waktu harus diisi').validate(body.time)

    const updatedAppointment = await AppointmentService.updateAppointment(
      id,
      res.locals.user.id,
      body,
    )

    return ResponseBuilder(
      {
        code: 200,
        message: `Appointment dengan id ${id} berhasil diupdate`,
        data: updatedAppointment,
      },
      res,
    )
  } catch (/** @type {any} */ error) {
    return ResponseBuilder(ErrorCatcher(error), res)
  }
}

export const getAllAppointment = async (
  /** @type {{ query: {page:string;limit:string;status:string;}; }} */ req,
  /** @type {import("express").Response<any, Record<string, any>>} */ res,
) => {
  try {
    if (!res.locals.isAdmin)
      throw new UnauthorizedError(
        'Anda tidak memiliki akses untuk melihat appointment',
      )

    const { page, limit, status } = req.query
    await string().validate(page)
    await string().validate(limit)
    await mixed().oneOf(['Booked', 'Completed', 'Cancelled']).validate(status)

    const appointments = await AppointmentService.getAllAppointments(
      parseInt(page),
      parseInt(limit),
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      status,
    )

    return ResponseBuilder(
      {
        code: 200,
        data: appointments,
        message: 'Data Appointment berhasil diambil',
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
