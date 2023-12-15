import { ORDER } from '../../types/order'
import { Order } from '../../models'
import { NotFoundError } from '../helpers/error'

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

  static async updateOrder(id: number, order: ORDER) {
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
