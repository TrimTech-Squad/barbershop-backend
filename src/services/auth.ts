import { User } from '../../models'
import bcrtpt from 'bcrypt'
import { UnauthorizedError } from '../helpers/error'
import { USER } from '../../types/user'
import jwt from 'jsonwebtoken'

export default class AuthService {
  static login(email: string, password: string): Promise<string> {
    return new Promise((resolve, reject) => {
      User.findOne({ where: { email } })
        .then((user: USER) => {
          if (!user) throw new UnauthorizedError('Email not found')
          bcrtpt.compare(password, user.password, (err, result) => {
            if (err) throw new UnauthorizedError('Password not match')
            if (!result) throw new UnauthorizedError('Password not match')
            const token = jwt.sign(
              { id: user.id, email: user.email },
              process.env.JWT_SECRET || 'secret',
              { expiresIn: '1d' },
            )
            resolve(token)
          })
        })
        .catch((err: Error) => {
          reject(err)
        })
    })
  }
}
