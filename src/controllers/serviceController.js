import ServiceServices from '../services/service'
import ResponseBuilder from '../helpers/response-builder'
import ErrorCatcher from '../helpers/error'

//GET DATA
export const getAllService = async (
  /** @type {{ body: any; }} */ _req,
  /** @type {import("express").Response<any, Record<string, any>>} */ res,
) => {
  try {
    const service = await ServiceServices.getAllServices()
    return ResponseBuilder(
      {
        code: 200,
        data: { service },
        message: 'Data Service berhasil diambil',
      },
      res,
    )
  } catch (/** @type {any} */ error) {
    return ResponseBuilder(ErrorCatcher(error), res)
  }
}
