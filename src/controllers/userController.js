import { object, string, number, mixed } from 'yup'
import UserService from '../services/user'
import ResponseBuilder from '../helpers/response-builder'
import ErrorCatcher from '../helpers/error'

// Validasi Yup Schema
const userUpdateSchema = object({
  name: string().required('Nama harus diisi'),
  password: string().required('Password harus diisi'),
  email: string().required('Email harus diisi').email('Email tidak valid'),
  number: string().required('Nomor harus diisi'),
  photo_url: string(),
  role: mixed().oneOf(['Customer', 'Admin']).required('Role harus diisi'),
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

    const user = await UserService.updateUser(id, body)

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
