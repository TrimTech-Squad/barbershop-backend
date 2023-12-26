import { mixed, number, object, string } from 'yup'
import KapsterServices from '../services/kapster'
import ResponseBuilder from '../helpers/response-builder'
import ErrorCatcher, { UnauthorizedError } from '../helpers/error'

/* The `kapsterSchema` is a validation schema defined using the `yup` library. It is used to validate
the data received in the request body for creating or updating a Kapster (a hairstylist). */
const kapsterSchema = object({
  name: string().required('Nama harus diisi'),
  gender: string().required('Gender harus diisi'),
  specialization: string().required('Specialization harus diisi'),
  status: mixed()
    .oneOf(['Available', 'Not Available', 'Resigned'])
    .required('Status harus diisi'),
})

export const createKapster = async (
  /** @type {{ body: any; }} */ req,
  /** @type {import("express").Response<any, Record<string, any>>} */ res,
) => {
  try {
    if (!res.locals.isAdmin)
      throw new UnauthorizedError('Anda tidak memiliki akses')

    const body = req.body
    await kapsterSchema.validate(body)
    const kapster = await KapsterServices.createKapster(req.body)
    return ResponseBuilder(
      {
        code: 201,
        message: 'Kapster successfully created.',
        data: kapster,
      },
      res,
    )
  } catch (/** @type {any} */ error) {
    return ResponseBuilder(ErrorCatcher(error), res)
  }
}

// READ ALL
export const getAllKapster = async (
  /** @type {{ body: any;query:{all:string,available:string} }} */ req,
  /** @type {import("express").Response<any, Record<string, any>>} */ res,
) => {
  try {
    const kapsters = await KapsterServices.getKapsters(
      !!req.query.all,
      !!req.query.available,
    )

    return ResponseBuilder(
      {
        code: 200,
        data: kapsters,
        message: 'Data Kapster berhasil diambil.',
      },
      res,
    )
  } catch (/** @type {any} */ error) {
    return ResponseBuilder(ErrorCatcher(error), res)
  }
}

export const getKapsterById = async (
  /** @type {{ body: any;params:{id:string} }} */ req,
  /** @type {import("express").Response<any, Record<string, any>>} */ res,
) => {
  try {
    const { id } = req.params

    await number().required('Id harus diisi').validate(parseInt(id))
    const kapster = await KapsterServices.getKapsterServices(parseInt(id))

    return ResponseBuilder(
      {
        code: 200,
        data: kapster,
        message: 'Data Kapster berhasil diambil.',
      },
      res,
    )
  } catch (/** @type {any} */ error) {
    return ResponseBuilder(ErrorCatcher(error), res)
  }
}

export const getKapsterSchedule = async (
  /** @type {{ params:{id:string},query:{date:string} }} */ req,
  /** @type {import("express").Response<any, Record<string, any>>} */ res,
) => {
  try {
    const { id } = req.params
    const { date } = req.query
    await string().required('Tanggal harus diisi').validate(date)
    await number().required('Id harus diisi').validate(parseInt(id))
    const kapsterSechedules =
      await KapsterServices.getAllKapsterScheduleByIdAndDate(
        parseInt(id),
        new Date(date),
      )
    return ResponseBuilder(
      {
        code: 200,
        data: kapsterSechedules,
        message: 'Data Jadwal Kapster berhasil diambil.',
      },
      res,
    )
  } catch (/** @type {any} */ error) {
    return ResponseBuilder(ErrorCatcher(error), res)
  }
}

export const updateKapsterData = async (
  /** @type {{ body: any;params:{id:string} }} */ req,
  /** @type {import("express").Response<any, Record<string, any>>} */ res,
) => {
  try {
    if (!res.locals.isAdmin)
      throw new UnauthorizedError('Anda tidak memiliki akses')
    const { id } = req.params

    await number().required('Id harus diisi').validate(parseInt(id))

    const body = req.body
    await kapsterSchema.validate(body)

    /* The code `const updatedKapster = await KapsterServices.updateKapster(parseInt(id), body)` is calling
the `updateKapster` method from the `KapsterServices` module. This method is responsible for
updating the data of a Kapster (hairstylist) with the specified `id` using the provided `body` data. */
    const updatedKapster = await KapsterServices.updateKapster(
      parseInt(id),
      body,
    )
    return ResponseBuilder(
      {
        code: 200,
        message: 'Kapster successfully updated.',
        data: { id, ...updatedKapster },
      },
      res,
    )
  } catch (/** @type {any} */ error) {
    return ResponseBuilder(ErrorCatcher(error), res)
  }
}
