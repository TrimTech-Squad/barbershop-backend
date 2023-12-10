import { User } from '../../models'
import { Request, Response, NextFunction } from 'express'
import { USERROLE, USERTOKENOBJECT } from '../../types/user'
import ErrorCatcher, { ForbiddenError } from '../response/error'
import ResponseBuilder from '../response/builder'

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export interface RequestMiddleware extends Request {
  user?: USERTOKENOBJECT
}

const isAdmin = async (
  req: RequestMiddleware,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user) {
      throw new ForbiddenError('You are not authorized to access this resource')
    }

    const user = await User.findOne({
      where: { id: req.user.id },
    })

    if (!user) {
      throw new ForbiddenError('You are not authorized to access this resource')
    }

    if (user?.role === USERROLE.ADMIN) {
      return next()
    }

    throw new ForbiddenError('You are not authorized to access this resource')
  } catch (error) {
    return ResponseBuilder(ErrorCatcher(error as Error), res)
  }
}
const AdminMiddlewares = {
  isAdmin,
}

export default AdminMiddlewares
