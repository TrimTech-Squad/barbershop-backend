import { User } from '../../models/index'
import { NotFoundError, UnauthorizedError } from '../helpers/error'
import { USER, USERROLE } from '../../types/user'
import bcrypt from 'bcrypt'

class UserServices {
  static createUser = async (user: Omit<USER, 'id'>): Promise<USER> => {
    return new Promise((resolve, reject) => {
      User.create(user)
        .then((data: USER | PromiseLike<USER>) => {
          resolve(data)
        })
        .catch((err: Error) => {
          reject(err)
        })
    })
  }

  static getUser = async (id: number) => {
    const userFound = await User.findOne({
      where: { id },
      attributes: { exclude: ['password'] },
    })
    if (!userFound) {
      throw new NotFoundError('User not found')
    }
    return userFound
  }

  static updateUserInfo = async (
    id: number,
    user: {
      name: string
      photo_url: string
      number: string
      email: string
    },
  ) => {
    const userFound = await User.findOne({
      where: { id },
      attributes: { exclude: ['password'] },
    })
    if (!userFound) {
      throw new NotFoundError('User not found')
    }

    return userFound.update(user)
  }

  static updateUserPassword = async (
    id: number,
    {
      old_password: oldPassword,
      new_password: newPassword,
    }: { old_password: string; new_password: string },
  ) => {
    return new Promise((resolve, reject) => {
      User.findOne({
        where: { id },
      })
        .then(
          (
            data: {
              dataValues: USER
              update: ({ password }: { password: string }) => Promise<void>
            } | null,
          ) => {
            if (!data) {
              return reject(new NotFoundError('User not found'))
            }

            bcrypt.compare(oldPassword, data.dataValues.password!, err => {
              if (err) {
                return reject(new UnauthorizedError('Wrong password'))
              }

              bcrypt.hash(newPassword, 10, async (err, hash) => {
                if (err) {
                  return reject(err)
                }
                await data.update({ password: hash })

                return resolve('Password updated')
              })
            })
          },
        )
        .catch((err: Error) => {
          reject(err)
        })
    })
  }

  static updateUserRole = async (
    { id, idRequester }: { id: number; idRequester: number },
    role: USERROLE,
  ) => {
    const isAuthorized = await User.findOne({
      where: { id: idRequester, role: USERROLE.ADMIN },
    })

    if (!isAuthorized) {
      throw new UnauthorizedError(
        'You are not authorized to access this resource',
      )
    }

    const userFound = await User.findOne({
      where: { id },
      attributes: { exclude: ['password'] },
    })

    if (!userFound) {
      throw new NotFoundError('User not found')
    }

    return userFound.update({ role })
  }
}

export default UserServices
