import { NextFunction, Request, Response } from 'express'
import AuthService from '../services/auth'
import ErrorCatcher, { UnauthorizedError } from '../helpers/error'
import { USERTOKENOBJECT } from '../../types/user'
import ResponseBuilder from '../helpers/response-builder'

export type RequestMiddleware = {
  user?: USERTOKENOBJECT
} & Request

export const auth = async (
  req: RequestMiddleware,
  res: Response,
  next: NextFunction,
) => {
  const bearerToken = req.cookies['access-token']
  if (!bearerToken) throw new UnauthorizedError('Access denied')
  const token = bearerToken.split(' ')[1]
  if (!token) throw new UnauthorizedError('Access denied')

  try {
    const decoded = await AuthService.verifyToken(bearerToken)
    req.user = decoded
    return next()
  } catch (err) {
    return ResponseBuilder(ErrorCatcher(err as Error), res)
  }
}
