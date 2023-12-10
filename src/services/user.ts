import { User } from '../../models/index'
import { NotFoundError } from '../utils/error'
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

  static getUser = async (id: string): Promise<USER> => {
    return new Promise((resolve, reject) => {
      User.findOne({
        where: { id },
      })
        .then((data: USER | null) => {
          if (data) {
            resolve(data)
          }
          reject(new NotFoundError('User not found'))
        })
        .catch((err: Error) => {
          reject(err)
        })
    })
  }

  static updateUser = async (id: string, user: Omit<USER, 'id'>) => {
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
