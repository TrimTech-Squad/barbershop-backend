import ServiceServices from '../services/service'
import ResponseBuilder from '../helpers/response-builder'
import ErrorCatcher, { UnauthorizedError } from '../helpers/error'
import { number, string } from 'yup'

// Mengambil semua data service
export const getAllService = async (
  /** @type {import("express").Request} */ _req,
  /** @type {import("express").Response<any, Record<string, any>>} */ res,
) => {
  try {
    // Mendapatkan semua service, jika isAdmin, maka dapatkan 'ALL' service
    const services = await ServiceServices.getAllServices(
      res.locals.isAdmin ? 'ALL' : undefined,
    )
    // Mengembalikan response sukses dengan data service
    return ResponseBuilder(
      {
        code: 200,
        data: services,
        message: 'Data Service berhasil diambil',
      },
      res,
    )
  } catch (/** @type {any} */ error) {
    // Mengembalikan response error dengan pesan kesalahan yang ditangkap
    return ResponseBuilder(ErrorCatcher(error), res)
  }
}

// Membuat service baru
export const createService = async (
  /** @type {import("express").Request} */ req,
  /** @type {import("express").Response} */ res,
) => {
  try {
    // Melemparkan error jika pengguna bukan admin
    if (!res.locals.isAdmin) {
      throw new UnauthorizedError('Anda tidak memiliki akses')
    }
    // Validasi input nama dan deskripsi service
    const body = req.body
    await string().required('Masukan Nama Serive').validate(body.serviceName)
    await string()
      .required('Masukan deskripsi Serive')
      .validate(body.description)

    // Membuat layanan baru dan mengembalikan response sukses
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
    // Mengembalikan response error dengan pesan kesalahan yang ditangkap
    return ResponseBuilder(ErrorCatcher(error), res)
  }
}

// Mendapatkan service yang tersedia untuk suatu id 
export const getAvailableService = async (
  /** @type {import("express").Request} */ req,
  /** @type {import("express").Response<any, Record<string, any>>} */ res,
) => {
  try {
    // Validasi parameter id harus berupa angka
    const { id } = req.params
    await number().validate(id)
    // Mendapatkan service yang tersedia untuk id tertentu
    const services = await ServiceServices.getServiceAndKaptserAvailable(
      parseInt(id),
    )

    // Mengembalikan response sukses dengan data service
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

// Memperbarui informasi layanan
export const updateService = async (
  /** @type {import("express").Request} */ req,
  /** @type {import("express").Response} */ res,
) => {
  try {
    // Melemparkan error jika pengguna bukan admin
    if (!res.locals.isAdmin) {
      throw new UnauthorizedError('Anda tidak memiliki akses')
    }
    // Validasi parameter id harus berupa angka
    const { id } = req.params
    await number().validate(id)
    // Validasi input nama dan deskripsi service
    const body = req.body
    await string().validate(body.serviceName)
    await string()
      .required('Masukan deskripsi Serive')
      .validate(body.description)
    
    // Memperbarui layanan berdasarkan id dan mengembalikan response sukses
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
