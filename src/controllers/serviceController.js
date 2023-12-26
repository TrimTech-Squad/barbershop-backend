import ServiceServices from '../services/service'
import ResponseBuilder from '../helpers/response-builder'
import ErrorCatcher, { UnauthorizedError } from '../helpers/error'
import { number, string } from 'yup'

//GET DATA
export const getAllService = async (
  /** @type {import("express").Request} */ req,
  /** @type {import("express").Response<any, Record<string, any>>} */ res,
) => {
  try {
    const services = await ServiceServices.getAllServices(
      req.query.all === 'true' ? 'ALL' : undefined,
    )
    return ResponseBuilder(
      {
        code: 200,
        data: services,
        message: 'Data Service berhasil diambil',
      },
      res,
    )
  } catch (/** @type {any} */ error) {
    return ResponseBuilder(ErrorCatcher(error), res)
  }
}

//Ge
export const createService = async (
  /** @type {import("express").Request} */ req,
  /** @type {import("express").Response} */ res,
) => {
  try {
    if (!res.locals.isAdmin) {
      throw new UnauthorizedError('Anda tidak memiliki akses')
    }
    const body = req.body
    await string().required('Masukan Nama Serive').validate(body.serviceName)
    await string()
      .required('Masukan deskripsi Serive')
      .validate(body.description)

    const service = await ServiceServices.createService(body)
    return ResponseBuilder(
      {
        code: 201,
        data: service,
        message: 'Data Service berhasil ditambahkan',
      },
      res,
    )
  } catch (/** @type {any} */ error) {
    return ResponseBuilder(ErrorCatcher(error), res)
  }
}

export const getAvailableService = async (
  /** @type {import("express").Request} */ req,
  /** @type {import("express").Response<any, Record<string, any>>} */ res,
) => {
  try {
    const { id } = req.params
    await number().validate(id)
    const services = await ServiceServices.getServiceAndKaptserAvailable(
      parseInt(id),
    )
    return ResponseBuilder(
      {
        code: 200,
        data: services,
        message: 'Data Service berhasil diambil',
      },
      res,
    )
  } catch (/** @type {any} */ error) {
    return ResponseBuilder(ErrorCatcher(error), res)
  }
}

export const updateService = async (
  /** @type {import("express").Request} */ req,
  /** @type {import("express").Response} */ res,
) => {
  try {
    if (!res.locals.isAdmin) {
      throw new UnauthorizedError('Anda tidak memiliki akses')
    }
    const { id } = req.params
    await number().validate(id)
    const body = req.body
    await string().validate(body.serviceName)
    await string()
      .required('Masukan deskripsi Serive')
      .validate(body.description)
    const service = await ServiceServices.updateService(parseInt(id), body)
    return ResponseBuilder(
      {
        code: 200,
        data: service,
        message: 'Data Service berhasil diupdate',
      },
      res,
    )
  } catch (/** @type {any} */ error) {
    return ResponseBuilder(ErrorCatcher(error), res)
  }
}
