import { NextFunction, Request, Response } from 'express'
import AuthService from '../services/auth'
import ErrorCatcher, { UnauthorizedError } from '../helpers/error'
import ResponseBuilder from '../helpers/response-builder'

// Middleware untuk otentikasi (authentication).
export const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Memeriksa apakah terdapat objek cookies dalam request.
    if (!req.cookies) throw new UnauthorizedError('Access denied')
    const bearerToken = req.cookies['access-token']

    // Memeriksa apakah cookie 'access-token' ada.
    if (!bearerToken) throw new UnauthorizedError('Access denied')

    // Mendapatkan nilai token dari string 'Bearer [token]'.
    const token = bearerToken.split(' ')[1]

    // Jika token tidak ada, lempar UnauthorizedError dengan pesan 'Access denied'.
    if (!token) throw new UnauthorizedError('Access denied')

    // Verifikasi token menggunakan layanan AuthService dan dekode hasilnya.
    const decoded = await AuthService.verifyToken(token)

    // Simpan informasi pengguna yang telah di-decode dalam res.locals.user.
    res.locals.user = decoded
    return next()
  } catch (err) {
    // Jika terjadi error selama proses otentikasi, hapus cookie 'access-token'.
    res.clearCookie('access-token')
    return ResponseBuilder(ErrorCatcher(err as Error), res)
  }
}
