import { User } from '../../models/index'
import { NotFoundError } from '../helpers/error'
import { USER } from '../../types/user'

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

  static getUser = async (id: number, idRequester: number): Promise<USER> => {
    return new Promise((resolve, reject) => {
      User.findOne({
        where: { id },
      })
        .then((data: USER | null) => {
          if (!data) {
            return reject(new NotFoundError('User not found'))
          }
          if (data?.id !== idRequester) {
            return reject(new NotFoundError('User not found'))
          }
          return resolve(data)
        })
        .catch((err: Error) => {
          reject(err)
        })
    })
  }

  static updateUser = async (id: number, user: Omit<USER, 'id'>) => {
    const userFound = await User.findOne({
      where: { id },
    })
    if (userFound) {
      return await userFound.update(user)
    }
    throw new NotFoundError('User not found')
  }
}

export default UserServices
