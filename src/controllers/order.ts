import { number, object, string } from 'yup'
import { Request, Response } from 'express'
import OrderServices from '../services/order'
import fetchTransactionToken, {
  fetchTransactionRefund,
  fetchTransactionStatus,
} from '../payments'
import { orderIdMaker } from '../utils/id_maker'
import KapsterServices from '../services/kapster'
import UserServices from '../services/user'
import ResponseBuilder from '../helpers/response-builder'
import ErrorCatcher, {
  BadRequestError,
  UnauthorizedError,
} from '../helpers/error'
import AppointmentService from '../services/appointment'
import { APPOINTMENTSTATUS } from '../../types/appointment'
import { TRANSACTION_STATUS } from '../../types/order'
import { renderHTML } from '../utils/ejs'

// Mendefinisikan skema validasi untuk data pesanan (order)
const orderSchema = object({
  booking_time: string().required(),
  kapsterServiceId: number().required(),
})

// Fungsi untuk membuat pesanan baru
export const createOrder = async (req: Request, res: Response) => {
  try {
    // Memastikan bahwa yang membuat pesanan bukan admin
    if (res.locals.isAdmin)
      throw new UnauthorizedError('Admin cannot create order')

    const { body } = req
    await orderSchema.validate(body)

    // Menambahkan ID pengguna ke data pesanan
    body.userId = res.locals.user.id

    // Mengambil detail pengguna dan service kapster
    const userDetail = await UserServices.getUser(body.userId)

    const kapsterService = await KapsterServices.getKapsterServiceById(
      body.kapsterServiceId,
    )

    // Memanggil fungsi untuk mendapatkan token transaksi pembayaran
    const paymentCharge = await fetchTransactionToken({
      transaction_details: {
        order_id: orderIdMaker((await OrderServices.getOrderCount()) + 1),
        gross_amount: kapsterService.price,
      },
      // Data item yang dibeli
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
      // Detail pelanggan
      customer_details: {
        first_name: userDetail.name,
        last_name: userDetail.name,
        email: userDetail.email,
        phone: userDetail.number,
      },
    })

    // Menambahkan data pembayaran ke pesanan
    body.token = paymentCharge.token
    body.redirect_url = paymentCharge.redirect_url
    body.gross_amount = paymentCharge.gross_amount
    body.id = paymentCharge.order_id

    // Menyimpan pesanan ke database
    await OrderServices.createOrder(body)

    // Mengembalikan respons sukses
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

// mengupdate status pesanan
export const updateOrder = async (req: Request, res: Response) => {
  try {
    // Memastikan bahwa yang mengupdate pesanan bukan admin
    if (res.locals.isAdmin)
      throw new UnauthorizedError('Admin cannot update order')

    const { body } = req

    // Validasi beberapa field yang dibutuhkan untuk update pesanan
    await string().required().validate(body.order_id)
    await string().required().validate(body.status_code)
    await string().required().validate(body.gross_amount)
    await string().required().validate(body.transaction_status)

    // Mendapatkan data pesanan dari database
    const order = await OrderServices.getOrder({ id: body.order_id })

    /* The `signature` variable is being assigned the result of calling the `getSigntatureKey` function
from the `OrderServices` module. This function takes three arguments: `order.id`,
`body.status_code`, and a string representation of `order.gross_amount` with `.00` appended to it.
The purpose of this function is to generate a signature key based on the provided arguments. The
generated signature key is then used to verify the authenticity of the request by comparing it with
the `body.signature_key` value. If the generated signature key matches the provided signature key,
the request is considered valid. */

    // Menghasilkan tanda tangan untuk verifikasi keaslian permintaan
    const signature = await OrderServices.getSigntatureKey(
      order.id!,
      body.status_code,
      `${order.gross_amount}.00`,
    )

    // Menghasilkan tanda tangan untuk verifikasi keaslian permintaan
    if (signature !== body.signature_key)
      throw new UnauthorizedError('Invalid signature key')

    /* The line `const response = await fetchTransactionStatus(body.order_id)` is calling the
   `fetchTransactionStatus` function and passing the `order_id` from the request body as an
   argument. It is awaiting the response from this function, which is likely an asynchronous API
   call to fetch the transaction status for the given order ID. The response is then stored in the
   `response` variable for further processing. */
   //// Memanggil fungsi untuk mendapatkan status transaksi pembayaran
    const response = await fetchTransactionStatus(body.order_id)

    // Jika terdapat respons dari fungsi
    if (response)
      await OrderServices.updateOrder(order.id!, {
        ...order.dataValues,
        ...response,
        gross_amount: parseFloat(response.gross_amount),
      })

    // Jika status transaksi adalah SETTLEMENT, membuat jadwal appointment baru
    if (response.transaction_status === TRANSACTION_STATUS.SETTLEMENT) {
      await AppointmentService.createAppointment({
        userId: order.userId,
        kapsterServiceId: order.kapsterServiceId,
        time: order.booking_time,
        status: APPOINTMENTSTATUS.BOOKED,
        orderId: order.id!,
        date: new Date().toISOString(),
      })
    }

    // Mengembalikan respons sukses
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


// Skema validasi untuk pembatalan pesanan dan fungsi untuk mengajukan refund
const orderCancelSchema = object({
  reason: string().required("Reason can't be empty"),
  amount: number().required("Amount can't be empty"),
})

// Fungsi untuk mengajukan permintaan pembatalan pesanan
export const requsetRefundOrder = async (req: Request, res: Response) => {
  try {
    // Memastikan bahwa yang mengajukan refund bukan admin
    if (res.locals.isAdmin)
      throw new UnauthorizedError('Admin cannot update order')

    const orderId = req.params.id
    const { body } = req

    // Validasi data yang dibutuhkan untuk refund
    await orderCancelSchema.validate(body)
    await string().required().validate(orderId)

    // Mendapatkan data pesanan dari database
    const { dataValues: order } = await OrderServices.getOrder({
      id: orderId,
      userId: res.locals.user.id,
    })

    // Menangani beberapa kondisi status pesanan untuk memastikan pesanan dapat di-refund
    if (order.transaction_status === TRANSACTION_STATUS.CANCEL) {
      throw new BadRequestError('Order already canceled')
    } else if (order.transaction_status === TRANSACTION_STATUS.DENY) {
      throw new BadRequestError('Order already denied')
    } else if (order.transaction_status === TRANSACTION_STATUS.EXPIRE) {
      throw new BadRequestError('Order already expired')
    } else if (order.transaction_status === TRANSACTION_STATUS.REFUND) {
      throw new BadRequestError('Order already refunded')
    } else if (order.transaction_status === TRANSACTION_STATUS.PARTIAL_REFUND) {
      throw new BadRequestError('Order already partially refunded')
    } else if (order.transaction_status === TRANSACTION_STATUS.FAILURE) {
      throw new BadRequestError('Order already failed')
    }

    // Persiapan data untuk permintaan refund
    const request: {
      reason: string
      amount: number
      order_id: string
      cancel_state: 'SETTLED' | 'UNSETTLED'
    } = {
      reason: body.reason,
      amount: body.amount,
      order_id: order.id!,
      cancel_state: 'SETTLED',
    }

    // Menentukan cancel_state berdasarkan status transaksi pesanan
    if (order.transaction_status === TRANSACTION_STATUS.SETTLEMENT)
      request.cancel_state = 'SETTLED'
    else request.cancel_state = 'UNSETTLED'

    // Memastikan jumlah refund tidak melebihi jumlah gross_amount pesanan
    if (order.gross_amount < body.amount) {
      throw new BadRequestError("Amount can't be greater than gross amount")
    }

    // Mengirim permintaan refund pesanan
    OrderServices.sendRequestRefundOrder(order, {
      reason: request.reason,
      amount: request.amount,
      cancel_state: request.cancel_state,
    })

    // Mengembalikan respons sukses
    return ResponseBuilder(
      {
        code: 200,
        message: 'Order cancel request successfuly issued',
        data: request,
      },
      res,
    )
  } catch (error) {
    return ResponseBuilder(ErrorCatcher(error as Error), res)
  }
}

// Fungsi untuk mendapatkan informasi refund pesanan
export const getRefundRequest = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    // Validasi data yang dibutuhkan untuk mendapatkan informasi refund
    await string().required().validate(id)

    // Mendapatkan data pesanan dari database berdasarkan signature_key
    const order = await OrderServices.getOrder({
      signature_key: id,
    })

    // Mengambil informasi refund dari layanan pembayaran eksternal
    const response = await fetchTransactionRefund(order.id!, {
      amount: order.refund_amount!,
      reason: order.refund_reason!,
    })

    // Jika status_code dari respons tidak '200', maka lemparkan error
    if (response.status_code !== '200') {
      throw response
    }

    // Mengupdate data pesanan dengan informasi refund
    await OrderServices.updateOrder(order.id!, {
      ...order.dataValues,
      ...response,
      signature_key: null,
      gross_amount: parseFloat(response.gross_amount),
      refund_amount: parseFloat(response.refund_amount),
    })

    // Mengembalikan HTML sebagai respons
    return res.send(
      await renderHTML(
        __dirname + '/../templates/page/order/cancel.ejs',
        {
          order: {
            isExist: true,
          },
          state: {
            ok: true,
            status_message: response.status_message,
          },
        },
        {},
      ),
    )
  } catch (error: unknown) {
    // Mengembalikan HTML sebagai respons dengan informasi pesanan tidak ditemukan
    return res.send(
      await renderHTML(
        __dirname + '/../templates/page/order/cancel.ejs',
        {
          order: {
            isExist: false,
          },
          state: {
            ok: false,
            status_message: (error as { status_message: string })
              .status_message,
          },
        },
        {},
      ),
    )
  }
}
