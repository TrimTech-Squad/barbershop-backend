import { User } from '../../models'
import { Request, Response, NextFunction } from 'express'
import { USERROLE, USERTOKENOBJECT } from '../types/user'
import ErrorCatcher, { ForbiddenError } from '../response/error'
import ResponseBuilder from '../response/builder'

const adminController = {
  isAdmin: async (
    req: Request & { user: USERTOKENOBJECT },
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const user = await User.findOne({
        where: { id: req.user.id },
      })

      if (!user) {
        throw new ForbiddenError(
          'You are not authorized to access this resource',
        )
      }

      if (user?.role === USERROLE.admin) {
        return next()
      }

      throw new ForbiddenError('You are not authorized to access this resource')
    } catch (error) {
      return ResponseBuilder(ErrorCatcher(error as Error), res)
    }
  },
}

export default adminController
