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
        .then((data: { dataValues: USER } | null) => {
          if (!data) {
            return reject(new NotFoundError('User not found'))
          }
          if (data?.dataValues.id !== idRequester) {
            return reject(new NotFoundError('User not found'))
          }
          const dataUser = { ...data.dataValues }
          delete dataUser.password
          return resolve(dataUser)
        })
        .catch((err: Error) => {
          reject(err)
        })
    })
  }

  static updateUserInfo = async (
    { id, idRequester }: { id: number; idRequester: number },
    user: {
      name: string
      photo_url: string
      number: string
      email: string
    },
  ) => {
    const userFound = await User.findOne({
      where: { id },
    })
    if (!userFound) {
      throw new NotFoundError('User not found')
    }

    if (userFound.id !== idRequester) {
      throw new NotFoundError('User not found')
    }

    return await userFound.update(user)
  }
}

export default UserServices
