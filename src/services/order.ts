import { ORDER } from '../../types/order'
import { Order } from '../../models'
import { NotFoundError } from '../helpers/error'
import crypto from 'crypto'

export default class OrderServices {
  static async createOrder(order: ORDER) {
    return new Promise((resolve, reject) => {
      Order.create(order)
        .then(data => {
          resolve(data)
        })
        .catch((err: Error) => {
          reject(err)
        })
    })
  }

  static async getOrder(id: number): Promise<ORDER & { dataValues: ORDER }> {
    return new Promise((resolve, reject) => {
      Order.findOne({ where: { id } })
        .then(data => {
          if (data) {
            resolve(data as unknown as ORDER & { dataValues: ORDER })
          } else {
            reject(new NotFoundError('Order not found'))
          }
        })
        .catch((err: Error) => {
          reject(err)
        })
    })
  }

  static getSigntatureKey(
    orderId: string,
    status_code: string,
    groos_amount: string,
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      try {
        const hash = crypto.createHash('sha512')
        //passing the data to be hashed
        const data = hash.update(
          orderId + status_code + groos_amount + process.env.SERVERKEY,
          'utf-8',
        )
        //Creating the hash in the required format
        const gen_hash = data.digest('hex')
        //Printing the output on the console
        resolve(gen_hash)
      } catch (err) {
        reject(err)
      }
    })
  }

  static async getOrderCount(): Promise<number> {
    return new Promise((resolve, reject) => {
      Order.count()
        .then(data => {
          resolve(data)
        })
        .catch((err: Error) => {
          reject(err)
        })
    })
  }

  static async updateOrder(id: string, order: ORDER) {
    return new Promise((resolve, reject) => {
      Order.findOne({ where: { id } })
        .then(data => {
          if (data) {
            data
              .update(order)
              .then(updatedData => {
                resolve(updatedData)
              })
              .catch((err: Error) => {
                reject(err)
              })
          } else {
            reject(new NotFoundError('Order not found'))
          }
        })
        .catch((err: Error) => {
          reject(err)
        })
    })
  }
}
