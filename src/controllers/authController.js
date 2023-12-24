/* eslint-disable @typescript-eslint/ban-ts-comment */
import { object, string, mixed } from 'yup'
import UserServices from '../services/user'
import ResponseBuilder from '../helpers/response-builder'
import ErrorCatcher from '../helpers/error'
import AuthService from '../services/auth'
import brypt from 'bcrypt'

export const register = async (
  /** @type {{ body: any; }} */ req,
  /** @type {import("express").Response<any, Record<string, any>>} */ res,
) => {
  // Skema validasi menggunakan Yup untuk data pengguna
  const userSchema = object({
    name: string().required('Nama harus diisi'),
    email: string().required('Email harus diisi').email('Email tidak valid'),
    password: string().required('Password harus diisi'),
    number: string().required('Nomor harus diisi'),
    photo_url: string(),
    role: mixed().oneOf(['Customer', 'Admin']).required('Role harus diisi'),
  })
  try {
    const body = req.body
    /* The line `body.role = 'Customer'` is assigning the value `'Customer'` to the `role` property of
   the `body` object. This is done before validating the `body` object against the `userSchema`. It
   ensures that the `role` property is always set to `'Customer'` before creating a new user. */
   // Skema validasi menggunakan Yup untuk data pengguna
    body.role = 'Customer'
    await userSchema.validate(body)

    // Menggunakan bcrypt untuk menghash password sebelum menyimpannya
    return brypt.hash(body.password, 10, async (err, hash) => {
      if (err) throw new Error(err.message)
      body.password = hash
      body.photo_url =
        'https://i.ibb.co/7tBZVZg/blank-profile-picture-973460-640.png'
      // Membuat pengguna baru menggunakan UserServices
      const user = await UserServices.createUser(body)
      return ResponseBuilder(
        {
          code: 201,
          message: 'User successfully created.',
          data: { id: user.id },
        },
        res,
      )
    })
  } catch (/** @type {any} */ error) {
    return ResponseBuilder(ErrorCatcher(error), res)
  }
}

const userSchema = object({
  email: string().required('Email harus diisi').email('Email tidak valid'),
  password: string().required('Password harus diisi'),
})
// Fungsi untuk melakukan login
export const login = async (
  /** @type {{ body: any; }} */ req,
  /** @type {import("express").Response<any, Record<string, any>>} */ res,
) => {
  try {
    const body = req.body

    // Validasi data login menggunakan skema
    await userSchema.validate(body)
    // Melakukan login menggunakan AuthService
    const user = await AuthService.login(body.email, body.password)
    /* The line `res.cookie('token', token, { httpOnly: true, maxAge: 3600 * 1000 })` is setting a cookie
  named 'token' in the response object (`res`). */
    // Menyimpan token sebagai cookie dalam respons
    res.clearCookie('access-token')
    res.cookie('access-token', `Bearer ${user.token}`, {
      httpOnly: true,
      maxAge: 24 * 3600 * 1000,
    })

    // Memberikan respons berhasil dengan token dan user role
    return ResponseBuilder(
      {
        code: 200,
        message: 'Login success.',
        data: {
          token: user.token,
          role: user.role,
        },
      },
      res,
    )
  } catch (/** @type {any} */ error) {
    return ResponseBuilder(ErrorCatcher(error), res)
  }
}

module.exports = { register, login }
