import { number, object } from 'yup'
import { Request, Response } from 'express'
import OrderServices from '../services/order'
import fetchTransactionToken from '../payments'
import { orderIdMaker } from '../utils/id_maker'
import KapsterServices from '../services/kapster'
import UserServices from '../services/user'
import ResponseBuilder from '../helpers/response-builder'
import ErrorCatcher, { UnauthorizedError } from '../helpers/error'

const orderSchema = object({
  userId: number().required(),
  booking_time: number().required(),
  kapsterServiceId: number().required(),
})

export const createOrder = async (req: Request, res: Response) => {
  try {
    if (res.locals.isAdmin)
      throw new UnauthorizedError('Admin cannot create order')

    const { body } = req
    await orderSchema.validate(body)

    const userDetail = await UserServices.getUser(body.userId)

    const kapsterService = await KapsterServices.getKapsterServiceById(
      body.kapsterServiceId,
    )

    body.groos_order = kapsterService.price

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

    await OrderServices.createOrder(body)

    return ResponseBuilder(
      {
        code: 201,
        message: 'Order created',
        data: {
          token: paymentCharge.token,
          redirect_url: paymentCharge.redirect_url,
        },
      },
      res,
    )
  } catch (error) {
    return ResponseBuilder(ErrorCatcher(error as Error), res)
  }
}
