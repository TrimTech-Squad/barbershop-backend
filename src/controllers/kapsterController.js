import { mixed, number, object, string } from 'yup'
import KapsterServices from '../services/kapster'
import ResponseBuilder from '../helpers/response-builder'
import ErrorCatcher, { UnauthorizedError } from '../helpers/error'

// Skema validasi untuk data kapster menggunakan 'yup'
const kapsterSchema = object({
  name: string().required('Nama harus diisi'),
  gender: string().required('Gender harus diisi'),
  specialization: string().required('Specialization harus diisi'),
  status: mixed()
    .oneOf(['Available', 'Unavailable', 'Resigned'])
    .required('Status harus diisi'),
})

// Fungsi untuk membuat kapster baru
export const createKapster = async (
  /** @type {{ body: any; }} */ req,
  /** @type {import("express").Response<any, Record<string, any>>} */ res,
) => {
  try {
    // Memastikan hanya admin yang dapat membuat kapster baru
    if (!res.locals.isAdmin)
      throw new UnauthorizedError('Anda tidak memiliki akses')

    const body = req.body
    // Melakukan validasi data menggunakan skema 'kapsterSchema'
    await kapsterSchema.validate(body)
    // Membuat kapster baru menggunakan KapsterService
    const kapster = await KapsterServices.createKapster(req.body)
    // Mengambil response berhasil
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

// READ ALL Kapster
export const getAllKapster = async (
  /** @type {{ body: any; }} */ _req,
  /** @type {import("express").Response<any, Record<string, any>>} */ res,
) => {
  try {
    // Mengambil semua kapster dari KapsterService
    const kapsters = await KapsterServices.getKapsters(
      res.locals.isAdmin ? true : undefined,
    )

    // Mengembalikan response dengan data kapster berhasil diambil
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

// Mendapatkan data kapster berdasarkan ID
export const getKapsterById = async (
  /** @type {{ body: any;params:{id:string} }} */ req,
  /** @type {import("express").Response<any, Record<string, any>>} */ res,
) => {
  try {
    const { id } = req.params

    // Melakukan validasi ID harus berupa angka
    await number().required('Id harus diisi').validate(parseInt(id))
    // Mengambil data kapster berdasarkan ID menggunakan KapsterServices
    const kapster = await KapsterServices.getKapsterServices(parseInt(id))

    // Mengembalikan respon dengan data kapster berhasil diambil
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

// Memperbarui data kapster berdasarkan ID
export const updateKapsterData = async (
  /** @type {{ body: any;params:{id:string} }} */ req,
  /** @type {import("express").Response<any, Record<string, any>>} */ res,
) => {
  try {
    // Memastikan hanya admin yang bisa memperbarui data kapster
    if (!res.locals.isAdmin)
      throw new UnauthorizedError('Anda tidak memiliki akses')
    const { id } = req.params

    // Melakukan validasi ID harus berupa angka
    await number().required('Id harus diisi').validate(parseInt(id))
    const body = req.body
    await kapsterSchema.validate(body)
    // Memperbarui data kapster berdasarkan ID menggunakan KapsterServices
    const updatedKapster = await KapsterServices.updateKapster(
      parseInt(id),
      body,
    )

    // Mengembalikan respon berhasil
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
