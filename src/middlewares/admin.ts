import { User } from '../../models'
import { Response, NextFunction, Request } from 'express'
import { USERROLE } from '../../types/user'
import ErrorCatcher, { ForbiddenError } from '../helpers/error'
import ResponseBuilder from '../helpers/response-builder'

// Middleware isAdmin digunakan untuk memeriksa apakah pengguna memiliki peran sebagai admin.
export const isAdmin = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // Jika tidak ada objek user pada res.locals, maka lemparkan error ForbiddenError.
    if (!res.locals.user) {
      throw new ForbiddenError('You are not authorized to access this resource')
    }

    // Cari pengguna berdasarkan ID dan email yang ada di res.locals.user.
    const user = await User.findOne({
      where: {
        id: res.locals.user.id,
        email: res.locals.user.email,
      },
    })

    // Jika pengguna tidak ditemukan, lemparkan error ForbiddenError.
    if (!user) {
      throw new ForbiddenError('You are not authorized to access this resource')
    }

    // Jika peran pengguna adalah ADMIN, tambahkan properti isAdmin pada res.locals
    // dan lanjutkan ke fungsi selanjutnya.
    if (user?.role === USERROLE.ADMIN) {
      res.locals.isAdmin = { isAdmin: true, ...user }
      return next()
    }
    
    return next()
  } catch (error) {
    // Jika terjadi error selama proses di atas, tangani error menggunakan ErrorCatcher
    // dan kirimkan response yang sesuai dengan ResponseBuilder.
    return ResponseBuilder(ErrorCatcher(error as Error), res)
  }
}
