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

export const getUserById = async (
  /** @type {{ body: any;params:{id:number}; }} */ req,
  /** @type {import("express").Response} */ res,
) => {
  try {
    const { id } = req.params
    await number().validate(id)
    const user = await UserService.getUser(id, res.locals.user.id)

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

export const updateDataUser = async (
  /** @type {{ body: any;params:{id:number} }} */ req,
  /** @type {import("express").Response<any, Record<string, any>>} */ res,
) => {
  try {
    const { id } = req.params
    await number().validate(id)
    const body = req.body
    // Validasi request menggunakan Yup
    await userUpdateSchema.validate(body)

    const user = await UserService.updateUserInfo(res.locals.user.id, body)

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

    const user = await UserService.updateUserPassword(res.locals.user.id, body)

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

export const updateUserRole = async (
  /** @type {{ body: any;params:{id:number} }} */ req,
  /** @type {import("express").Response<any, Record<string, any>>} */ res,
) => {
  try {
    const { id } = req.params
    await number().validate(id)
    const body = req.body
    // Validasi request menggunakan Yup
    await string()
      .required('Role harus diisi')
      .oneOf(['Customer', 'Admin'])
      .validate(body.role)

    const user = await UserService.updateUserRole(
      { id, idRequester: res.locals.user.id },
      body.role,
    )

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
