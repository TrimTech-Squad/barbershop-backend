import { ORDER } from '../../types/order'
import { Order, User } from '../../models'
import { NotFoundError } from '../helpers/error'
import UserServices from './user'
import ServiceServices from './service'
import { generateSha512 } from '../utils/sha'
import { USERROLE } from '../../types/user'
import { sendMail } from './mail'
import { renderHTML } from '../utils/ejs'

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

  static async getOrder(querry: {
    id: string
    userId?: number
  }): Promise<ORDER & { dataValues: ORDER }> {
    return new Promise((resolve, reject) => {
      Order.findOne({ where: querry })
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

  static async sendRequestCancleOrder(
    order: ORDER,
    cancel: {
      reason: string
      amount: number
      cancel_state: 'SETTLED' | 'UNSETTLED'
    },
  ) {
    const user = await UserServices.getUser(order.userId)
    const kapsterService = await ServiceServices.getKapsterService(
      order.kapsterServiceId,
    )

    const generatedSigntatureKey = generateSha512(
      user.email +
        order.id! +
        cancel.reason +
        cancel.amount +
        cancel.cancel_state +
        user.password +
        Date.now(),
    )

    await OrderServices.updateOrder(order.id!, {
      ...order,
      signature_key: generatedSigntatureKey,
    })

    const emailRequest: {
      service: {
        name: string
        kapster: string
        price: number
      }
      user: {
        name: string
        email: string
        number: string
      }
      order: {
        id: string
        date: string
        status: string
        payment_type: string
        gross_amount: number
        transaction_id: string
      }
      cancel: {
        reason: string
        amount: number
        url: string
      }
    } = {
      service: {
        name: kapsterService.service.serviceName,
        kapster: kapsterService.kapster.name,
        price: kapsterService.price,
      },
      user: {
        name: user.name,
        email: user.email,
        number: user.number,
      },
      order: {
        id: order.id!,
        date: new Date(order.createdAt!).toLocaleDateString(),
        status: order.transaction_status!,
        payment_type: order.payment_type!,
        transaction_id: order.transaction_id!,
        gross_amount: order.gross_amount!,
      },
      cancel: {
        reason: cancel.reason,
        amount: cancel.amount,
        url:
          'https://trimtech.id/cancel/' +
          generatedSigntatureKey +
          '?state=' +
          cancel.cancel_state,
      },
    }

    const adminUser = await User.findAll({ where: { role: USERROLE.ADMIN } })

    if (adminUser.length === 0) return console.log('Admin not found')

    const renderedHTML = await renderHTML(
      __dirname + '/../templates/email/cancelation.ejs',
      emailRequest,
      {},
    )

    sendMail(
      adminUser
        .map((e: { dataValues: { email: string } }) => e.dataValues.email)
        .join(','),
      'Cancel Order Request',
      renderedHTML,
    )

    return
  }

  static getSigntatureKey(
    orderId: string,
    status_code: string,
    groos_amount: string,
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      try {
        const signature = generateSha512(
          orderId + status_code + groos_amount + process.env.SERVERKEY,
        )

        resolve(signature)
      } catch (err: unknown) {
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
