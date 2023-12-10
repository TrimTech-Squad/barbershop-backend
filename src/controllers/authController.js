/* eslint-disable @typescript-eslint/ban-ts-comment */
import { object, string, mixed } from 'yup'
import UserServices from '../services/user'
import ResponseBuilder from '../helpers/response-builder'
import ErrorCatcher from '../helpers/error'
import AuthService from '../services/auth'

export const register = async (
  /** @type {{ body: any; }} */ req,
  /** @type {import("express").Response<any, Record<string, any>>} */ res,
) => {
  const userSchema = object({
    name: string().required('Nama harus diisi'),
    email: string().required('Email harus diisi').email('Email tidak valid'),
    password: string().required('Password harus diisi'),
    photo_url: string(),
    number: string().required('Nomor harus diisi'),
    role: mixed().oneOf(['Customer', 'Admin']).required('Role harus diisi'),
  })
  try {
    const body = req.body
    await userSchema.validate(body)
    await UserServices.createUser(body)
    return ResponseBuilder(
      {
        code: 201,
        message: 'User successfully created.',
        data: null,
      },
      res,
    )
  } catch (error) {
    // @ts-ignore
    return ResponseBuilder(ErrorCatcher(error), res)
  }
}

export const login = async (
  /** @type {{ body: any; }} */ req,
  /** @type {import("express").Response<any, Record<string, any>>} */ res,
) => {
  const userSchema = object({
    email: string().required('Email harus diisi').email('Email tidak valid'),
    password: string().required('Password harus diisi'),
  })
  try {
    const body = req.body
    await userSchema.validate(body)
    const token = await AuthService.login(body.email, body.password)
    /* The line `res.cookie('token', token, { httpOnly: true, maxAge: 3600 * 1000 })` is setting a cookie
  named 'token' in the response object (`res`). */
    res.cookie('token', `Bearer ${token}`, {
      httpOnly: true,
      maxAge: 3600 * 1000,
    })
    return ResponseBuilder(
      {
        code: 200,
        message: 'Login success.',
        data: token,
      },
      res,
    )
  } catch (/** @type {any} */ error) {
    return ResponseBuilder(ErrorCatcher(error), res)
  }
}
