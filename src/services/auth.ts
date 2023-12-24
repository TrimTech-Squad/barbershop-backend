import { User } from '../../models'
import bcrypt from 'bcrypt'
import { UnauthorizedError } from '../helpers/error'
import { USER } from '../../types/user'
import jwt from 'jsonwebtoken'

export default class AuthService {
  // melakukan otentikasi pengguna berdasarkan email dan password.
  static login(
    email: string,
    password: string,
  ): Promise<{ token: string; role: string }> {
    return new Promise((resolve, reject) => {
       // Mencari pengguna berdasarkan email dalam database.
      User.findOne({ where: { email } })
        .then((user: USER) => {
          
          // Jika pengguna tidak ditemukan, maka lemparkan error UnauthorizedError.
          if (!user) throw new UnauthorizedError('Invalid email or password')

          // Membandingkan password yang dimasukkan dengan password di database menggunakan bcrypt.
          bcrypt.compare(password, user.password!, (err, result) => {
            if (err) reject(new UnauthorizedError('Invalid email or password'))

            // Jika password tidak cocok, lemparkan error UnauthorizedError.
            if (!result)
              reject(new UnauthorizedError('Invalid email or password'))

            // Jika berhasil, membuat token JWT dengan payload berisi id dan email pengguna.
            const token = jwt.sign(
              { id: user.id, email: user.email },
              process.env.JWT_SECRET || 'secret',
              { expiresIn: '1d' },
            )

            // Mengembalikan token dan peran (role) pengguna.
            resolve({ token, role: user.role })
          })
        })
        .catch((err: Error) => {
          reject(err)
        })
    })
  }

  static verifyToken(token: string): Promise<{ id: number; email: string }> {
    return new Promise((resolve, reject) => {
      jwt.verify(token, process.env.JWT_SECRET || 'secret', (err, decoded) => {
        if (err) reject(new UnauthorizedError('Invalid token'))

        User.findOne({ where: { id: (decoded as { id: number }).id } })
          .then((user: USER) => {
            if (user) return resolve(decoded as { id: number; email: string })
            return reject(new UnauthorizedError('Invalid token'))
          })
          .catch((err: Error) => {
            reject(err)
          })
      })
    })
  }
}
