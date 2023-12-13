import { NextFunction, Request, Response } from 'express'
import AuthService from '../services/auth'
import ErrorCatcher, { UnauthorizedError } from '../helpers/error'
import ResponseBuilder from '../helpers/response-builder'

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  const bearerToken = req.cookies['access-token']
  if (!bearerToken) throw new UnauthorizedError('Access denied')
  const token = bearerToken.split(' ')[1]
  if (!token) throw new UnauthorizedError('Access denied')

  try {
    const decoded = await AuthService.verifyToken(bearerToken)
    res.locals.user = decoded
    return next()
  } catch (err) {
    return ResponseBuilder(ErrorCatcher(err as Error), res)
  }
}
