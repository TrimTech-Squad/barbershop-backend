import { User } from '../../models'
import { Response, NextFunction } from 'express'
import { USERROLE } from '../../types/user'
import ErrorCatcher, { ForbiddenError } from '../helpers/error'
import ResponseBuilder from '../helpers/response-builder'

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions

const isAdmin = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    if (!res.locals.user) {
      throw new ForbiddenError('You are not authorized to access this resource')
    }

    const user = await User.findOne({
      where: { id: res.locals.user.id },
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
