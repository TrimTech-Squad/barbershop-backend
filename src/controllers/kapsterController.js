import { object, string } from 'yup'
import KapsterServices from '../services/kapster'
import ResponseBuilder from '../helpers/response-builder'
import ErrorCatcher from '../helpers/error'

export const createKapster = async (
  /** @type {{ body: any; }} */ req,
  /** @type {import("express").Response<any, Record<string, any>>} */ res,
) => {
  const kapsterSchema = object({
    name: string().required('Nama harus diisi'),
    gender: string().required('Gender harus diisi'),
    specialization: string().required('Specialization harus diisi'),
  })
  try {
    const body = req.body
    await kapsterSchema.validate(body)
    await KapsterServices.createKapster(req.body)
    return ResponseBuilder(
      {
        code: 201,
        message: 'Kapster successfully created.',
        data: null,
      },
      res,
    )
  } catch (/** @type {any} */ error) {
    return ResponseBuilder(ErrorCatcher(error), res)
  }
}

// READ ALL
export const getAllKapster = async (
  /** @type {{ body: any; }} */ _req,
  /** @type {import("express").Response<any, Record<string, any>>} */ res,
) => {
  try {
    const kapsters = await KapsterServices.getKapsters()

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
