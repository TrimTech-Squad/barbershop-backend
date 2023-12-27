import { User } from '../../models'
import { Response, NextFunction, Request } from 'express'
import { USERROLE } from '../../types/user'
import ErrorCatcher, { ForbiddenError } from '../helpers/error'
import ResponseBuilder from '../helpers/response-builder'

export const isAdmin = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!res.locals.user) {
      throw new ForbiddenError('You are not authorized to access this resource')
    }

    const user = await User.findOne({
      where: {
        id: res.locals.user.id,
        email: res.locals.user.email,
      },
    })

    if (!user) {
      throw new ForbiddenError('You are not authorized to access this resource')
    }

    if (user?.role === USERROLE.ADMIN) {
      res.locals.isAdmin = { isAdmin: true, ...user }
      return next()
    }

    return next()
  } catch (error) {
    return ResponseBuilder(ErrorCatcher(error as Error), res)
  }
}
