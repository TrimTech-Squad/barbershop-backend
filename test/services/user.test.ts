import UserServices from '../../src/services/user'
import { USER, USERROLE } from '../../types/user'
import { describe, it, expect } from 'vitest'

describe('user services', async () => {
  const userCtx: USER = {
    id: 0,
    email: Math.random() * 100 + '@gmail.com',
    password: '12345678',
    role: USERROLE.CUSTOMER,
    name: 'nishi',
    photo_url: '',
    number: '08123456789',
  }

  it('should can create user', async () => {
    const user = { ...userCtx }
    delete user.id
    const data = await UserServices.createUser(user)

    expect(data.email).toEqual(data.email)
    expect(data.password).toEqual(data.password)
    expect(data.role).toEqual(data.role)
    expect(data.name).toEqual(data.name)
    expect(data.photo_url).toEqual(data.photo_url)
    expect(data.number).toEqual(data.number)
    expect(data.id).toBeTypeOf('number')
  })

  it('should get user info', async () => {
    const data = await UserServices.getUser(0)
    expect(data.email).toEqual(data.email)
    expect(data.password).toEqual(data.password)
    expect(data.role).toEqual(data.role)
    expect(data.name).toEqual(data.name)
    expect(data.photo_url).toEqual(data.photo_url)
    expect(data.number).toEqual(data.number)
    expect(data.id).toBeTypeOf('number')
  })

  it('should throw error when user not found', async () => {
    await expect(UserServices.getUser(-1)).rejects.toThrow('User not found')
  })

  it('should can update user', async () => {
    const updatedUser = {
      id: 0,
      email: Math.random() * 100 + '@gmail.com',
      password: '12345678',
      role: USERROLE.ADMIN,
      name: 'nishi',
      photo_url: '',
      number: '232121321',
    }

    const data = await UserServices.updateUserInfo(0, updatedUser)

    expect(data.email).toEqual(updatedUser.email)
    expect(data.password).toEqual(updatedUser.password)
    expect(data.role).toEqual(updatedUser.role)
    expect(data.name).toEqual(updatedUser.name)
    expect(data.photo_url).toEqual(updatedUser.photo_url)
    expect(data.number).toEqual(updatedUser.number)
    expect(data.id).toBeTypeOf('number')
  })

  it('should throw error when user not found', async () => {
    await expect(UserServices.updateUserInfo(0, userCtx)).rejects.toThrow(
      'User not found',
    )
  })

  it('it should can update password', async () => {
    const data = await UserServices.updateUserPassword(0, {
      old_password: '12345678',
      new_password: '12345678',
    })
    expect(data).toBeTypeOf('object')
  })

  it('should throw error when idRequester not same as id ', async () => {
    await expect(
      UserServices.updateUserPassword(0, {
        old_password: '12345678',
        new_password: '12345678',
      }),
    ).rejects.toThrow('User not found')
  })

  it('should can update role if ADMIN', async () => {
    const data = await UserServices.updateUserRole(
      { id: 0, idRequester: 1 },
      USERROLE.ADMIN,
    )
    expect(data).toBeTypeOf('object')
  })

  it('should cant update role if CUSTOMER', async () => {
    await expect(
      UserServices.updateUserRole({ id: 0, idRequester: 3 }, USERROLE.ADMIN),
    ).rejects.toThrow('You are not authorized to access this resource')
  })
})
