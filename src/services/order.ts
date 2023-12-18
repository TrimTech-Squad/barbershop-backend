import { ORDER } from '../../types/order'
import { Order, User } from '../../models'
import { NotFoundError } from '../helpers/error'
import UserServices from './user'
import ServiceServices from './service'
import { generateHashString } from '../utils/sha'
import { USERROLE } from '../../types/user'
import { sendMail } from './mail'
import { renderHTML } from '../utils/ejs'

type EmailTemplateObject = {
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
  context: {
    reason: string
    amount: number
    btn_url: string
    btn_title: string
    title: string
    description: string
    type: 'cancel' | 'refund' | 'info'
  }
}

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

  static async getOrder(
    querry: Partial<ORDER>,
  ): Promise<ORDER & { dataValues: ORDER }> {
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

  static async sendRequestRefundOrder(
    order: ORDER,
    cancel: {
      reason: string
      amount: number
      cancel_state: 'SETTLED' | 'UNSETTLED'
    },
  ) {
    try {
      const user = await UserServices.getUser(order.userId)
      const kapsterService = await ServiceServices.getKapsterService(
        order.kapsterServiceId,
      )

      const generatedSigntatureKey = generateHashString(
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
        refund_amount: cancel.amount,
        refund_reason: cancel.reason,
      })

      const emailObject: EmailTemplateObject = {
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
        context: {
          type: 'refund',
          reason: cancel.reason,
          amount: cancel.amount,
          btn_url:
            process.env.SERVERBASEURL +
            '/order/confirm-refund/' +
            generatedSigntatureKey +
            '?state=' +
            cancel.cancel_state,
          btn_title: 'Approve Refund Request',
          title: 'Refund Request',
          description:
            '<b>A user has requested to Refund the order</b>, please see the details below and confirm the Refund request if the Refund request is valid.',
        },
      }

      const adminUser = await User.findAll({ where: { role: USERROLE.ADMIN } })

      if (adminUser.length === 0) return console.log('Admin not found')

      const renderedHTML = await renderHTML(
        __dirname + '/../templates/email/order-template.ejs',
        emailObject,
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
    } catch (err) {
      console.error(err)
    }
  }

  static getSigntatureKey(
    orderId: string,
    status_code: string,
    groos_amount: string,
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      try {
        const signature = generateHashString(
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
