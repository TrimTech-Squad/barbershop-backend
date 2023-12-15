import { number, object, string } from 'yup'
import { Request, Response } from 'express'
import OrderServices from '../services/order'
import fetchTransactionToken from '../payments'
import { orderIdMaker } from '../utils/id_maker'
import KapsterServices from '../services/kapster'
import UserServices from '../services/user'
import ResponseBuilder from '../helpers/response-builder'
import ErrorCatcher, { UnauthorizedError } from '../helpers/error'
import AppointmentService from '../services/appointment'
import { APPOINTMENTSTATUS } from '../../types/appointment'

const orderSchema = object({
  booking_time: string().required(),
  kapsterServiceId: number().required(),
})

export const createOrder = async (req: Request, res: Response) => {
  try {
    if (res.locals.isAdmin)
      throw new UnauthorizedError('Admin cannot create order')

    const { body } = req
    await orderSchema.validate(body)

    body.userId = res.locals.user.id

    const userDetail = await UserServices.getUser(body.userId)

    const kapsterService = await KapsterServices.getKapsterServiceById(
      body.kapsterServiceId,
    )

    const paymentCharge = await fetchTransactionToken({
      transaction_details: {
        order_id: orderIdMaker((await OrderServices.getOrderCount()) + 1),
        gross_amount: kapsterService.price,
      },
      item_details: [
        {
          id: kapsterService.service.id!,
          price: kapsterService.price,
          name: kapsterService.service.serviceName,
          merchant_name: 'TrimTech',
          quantity: 1,
          url: 'https://trimtech.id/service/' + kapsterService.service.id,
        },
      ],
      customer_details: {
        first_name: userDetail.name,
        last_name: userDetail.name,
        email: userDetail.email,
        phone: userDetail.number,
      },
    })

    body.token = paymentCharge.token
    body.redirect_url = paymentCharge.redirect_url
    body.gross_amount = paymentCharge.gross_amount
    body.id = paymentCharge.order_id

    await OrderServices.createOrder(body)

    return ResponseBuilder(
      {
        code: 201,
        message: 'Order created',
        data: {
          token: paymentCharge.token,
          redirect_url: paymentCharge.redirect_url,
          groos_amount: paymentCharge.gross_amount,
        },
      },
      res,
    )
  } catch (error) {
    return ResponseBuilder(ErrorCatcher(error as Error), res)
  }
}

export const updateOrder = async (req: Request, res: Response) => {
  try {
    if (res.locals.isAdmin)
      throw new UnauthorizedError('Admin cannot update order')

    const { body } = req

    await string().required().validate(body.order_id)
    await string().required().validate(body.status_code)
    await string().required().validate(body.gross_amount)
    await string().required().validate(body.transaction_status)

    const order = await OrderServices.getOrder(body.order_id)

    const signature = await OrderServices.getSigntatureKey(
      order.id!,
      body.status_code,
      `${order.gross_amount}.00`,
    )

    if (signature !== body.signature_key)
      throw new UnauthorizedError('Invalid signature key')

    if (body) await OrderServices.updateOrder(order.id!, body)

    if (body.transaction_status === 'settlement') {
      await AppointmentService.createAppointment({
        userId: order.userId,
        kapsterServiceId: order.kapsterServiceId,
        time: order.booking_time,
        status: APPOINTMENTSTATUS.BOOKED,
        orderId: order.id!,
        date: new Date().toISOString(),
      })
    }

    return ResponseBuilder(
      {
        code: 200,
        message: 'Order updated',
        data: null,
      },
      res,
    )
  } catch (error) {
    return ResponseBuilder(ErrorCatcher(error as Error), res)
  }
}
