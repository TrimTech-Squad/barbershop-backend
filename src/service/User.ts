import { User } from '../models'
import { NotFoundError } from '../response/error'
import { USER } from '../types/user'

class UserServices {
  static createUser = async (user: Omit<USER, 'id'>) => {
    return await User.create(user)
  }

  static getUser = async (id: string) => {
    const userFound = await User.findOne({
      where: { id },
    })
    if (userFound) {
      delete userFound.password
      return userFound
    }
    throw new NotFoundError('User not found')
  }

  static updateUser = async (id: string, user: USER) => {
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
