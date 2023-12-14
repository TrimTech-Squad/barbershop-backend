import { NextFunction, Request, Response } from 'express'
import AuthService from '../services/auth'
import ErrorCatcher, { UnauthorizedError } from '../helpers/error'
import ResponseBuilder from '../helpers/response-builder'

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.cookies) throw new UnauthorizedError('Access denied')
    const bearerToken = req.cookies['access-token']
    if (!bearerToken) throw new UnauthorizedError('Access denied')
    const token = bearerToken.split(' ')[1]
    if (!token) throw new UnauthorizedError('Access denied')
    const decoded = await AuthService.verifyToken(token)
    res.locals.user = decoded
    return next()
  } catch (err) {
    res.clearCookie('access-token')
    return ResponseBuilder(ErrorCatcher(err as Error), res)
  }
}
