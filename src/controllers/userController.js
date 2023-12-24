import { object, string, number } from 'yup'
import UserService from '../services/user'
import ResponseBuilder from '../helpers/response-builder'
import ErrorCatcher from '../helpers/error'

// Validasi Yup Schema
const userUpdateSchema = object({
  name: string().required('Nama harus diisi'),
  email: string().required('Email harus diisi').email('Email tidak valid'),
  number: string().required('Nomor harus diisi'),
  photo_url: string(),
})

// Fungsi untuk mendapatkan data pengguna berdasarkan ID pengguna
export const getUserById = async (
  /** @type {{ body: any;params:{id:number}; }} */ _req,
  /** @type {import("express").Response} */ res,
) => {
  try {
    // Panggil layanan pengguna untuk mendapatkan data pengguna
    const user = await UserService.getUser(res.locals.user.id)

    // Mengembalikan respon dengan data pengguna yang berhasil diambil
    return ResponseBuilder(
      {
        code: 200,
        data: user,
        message: 'Data User berhasil diambil',
      },
      res,
    )
  } catch (/** @type {any} */ error) {
    return ResponseBuilder(ErrorCatcher(error), res)
  }
}

// Fungsi untuk memperbarui data pengguna
export const updateDataUser = async (
  /** @type {{ body: any;params:{id:number} }} */ req,
  /** @type {import("express").Response<any, Record<string, any>>} */ res,
) => {
  try {
    // Dapatkan ID dari parameter permintaan
    const { id } = req.params
    // Validasi ID menggunakan Yup untuk memastikan itu adalah angka
    await number().validate(id)
    const body = req.body
    // Validasi request menggunakan Yup
    await userUpdateSchema.validate(body)

    // Panggil UserService untuk memperbarui informasi user
    const user = await UserService.updateUserInfo(res.locals.user.id, body)

    // Mengembalikan respon dengan data pengguna yang berhasil diperbarui
    return ResponseBuilder(
      {
        code: 200,
        data: user,
        message: 'Data User berhasil diupdate',
      },
      res,
    )
  } catch (/** @type {any} */ error) {
    return ResponseBuilder(ErrorCatcher(error), res)
  }
}

// Fungsi untuk memperbarui kata sandi pengguna
export const updateUserPassword = async (
  /** @type {{ body: any;params:{id:number} }} */ req,
  /** @type {import("express").Response<any, Record<string, any>>} */ res,
) => {
  try {
    const body = req.body
    // Validasi request menggunakan Yup 
    await string()
      .required('Password lama harus diisi')
      .validate(body.old_password)
    await string()
      .required('Password baru harus diisi')
      .validate(body.new_password)

    // Panggil UserService untuk memperbarui kata sandi pengguna
    const user = await UserService.updateUserPassword(res.locals.user.id, body)

    // Mengembalikan respon dengan data pengguna yang berhasil diupdate
    return ResponseBuilder(
      {
        code: 200,
        data: user,
        message: 'Password User berhasil diupdate',
      },
      res,
    )
  } catch (/** @type {any} */ error) {
    return ResponseBuilder(ErrorCatcher(error), res)
  }
}

// Fungsi untuk memperbarui userRole
export const updateUserRole = async (
  /** @type {{ body: any;params:{id:number} }} */ req,
  /** @type {import("express").Response<any, Record<string, any>>} */ res,
) => {
  try {
    const { id } = req.params
    // Validasi ID menggunakan Yup untuk memastikan itu adalah angka
    await number().validate(id)
    const body = req.body
    // Validasi request menggunakan Yup
    await string()
      .required('Role harus diisi')
      .oneOf(['Customer', 'Admin'])
      .validate(body.role)

    // Panggil UserService untuk memperbarui peran pengguna
    const user = await UserService.updateUserRole(
      { id, idRequester: res.locals.user.id },
      body.role,
    )
    // Mengembalikan respon dengan data pengguna yang berhasil diupdate
    return ResponseBuilder(
      {
        code: 200,
        data: user,
        message: 'Role User berhasil diupdate',
      },
      res,
    )
  } catch (/** @type {any} */ error) {
    return ResponseBuilder(ErrorCatcher(error), res)
  }
}
