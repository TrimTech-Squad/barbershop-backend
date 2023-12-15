import axios from 'axios'
import dotenv from 'dotenv'
import { FRAUD_STATUS, TRANSACTION_STATUS } from '../../types/order'
dotenv.config()
export type SnapResponse = {
  token: string
  redirect_url: string
  gross_amount: number
  order_id: string
}

export type TransactionDetails = {
  order_id: string
  gross_amount: number
}

export type ItemDetails = {
  id: string | number
  price: number
  name: string
  quantity: number
  merchant_name: 'TrimTech'
  url: string
}[]

export type CustomerDetails = {
  first_name: string
  last_name: string
  email: string
  phone: string
}

export type TransactionRequest = {
  transaction_details: TransactionDetails
  item_details: ItemDetails
  customer_details: CustomerDetails
}

function getDateFormated(date: Date) {
  const year = date.getFullYear()
  const month =
    date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
  const day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
  const hour = date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
  const minute =
    date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
  const second =
    date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
  return `${year}-${month}-${day} ${hour}:${minute}:${second} +0700`
}

const enabled_payments = [
  'credit_card',
  'cimb_clicks',
  'bca_klikbca',
  'bca_klikpay',
  'bri_epay',
  'echannel',
  'permata_va',
  'bca_va',
  'bni_va',
  'bri_va',
  'cimb_va',
  'other_va',
  'gopay',
  'indomaret',
  'danamon_online',
  'akulaku',
  'shopeepay',
  'kredivo',
  'uob_ezpay',
]

export const fetchTransactionToken = async (
  data: TransactionRequest,
): Promise<SnapResponse> => {
  const formatedDate = getDateFormated(new Date())
  const requestObject = {
    ...data,
    enabled_payments,
    expiry: {
      start_time: formatedDate,
      unit: 'day',
      duration: 1,
    },
    page_expiry: {
      duration: 2,
      unit: 'hours',
    },

    bni_va: {
      va_number: '12345678',
    },
    bri_va: {
      va_number: '1234567891234',
    },

    permata_va: {
      va_number: '1234567890',
      recipient_name: 'SUDARSONO',
    },
    shopeepay: {
      callback_url: 'http://shopeepay.com',
    },
    gopay: {
      enable_callback: true,
      callback_url: 'http://gopay.com',
    },
    callbacks: {
      finish: 'https://demo.midtrans.com',
    },
    uob_ezpay: {
      callback_url: 'http://uobezpay.com',
    },
    recurring: {
      required: true,
      start_time: formatedDate,
      interval_unit: 'week',
    },
  }
  return new Promise((resolve, reject) => {
    axios
      .post<{
        token: string
        redirect_url: string
      }>(process.env.PAYMENTGATEWAYURL ?? '', JSON.stringify(requestObject), {
        headers: {
          Authorization: 'Basic ' + btoa(process.env.SERVERKEY ?? '' + ':'),
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      })
      .then(res => {
        resolve({
          ...res.data,
          gross_amount: data.transaction_details.gross_amount,
          order_id: data.transaction_details.order_id,
        })
      })
      .catch(err => {
        reject(err)
      })
  })
}

export default fetchTransactionToken

export type TypeResponseStatus = {
  status_code: string
  transaction_id: string
  gross_amount: string
  currency: string
  order_id: string
  payment_type: string
  signature_key: string
  transaction_status: TRANSACTION_STATUS
  fraud_status: FRAUD_STATUS
  status_message: string
  merchant_id: string
  payment_code: string
  store: string
  transaction_time: string
  expiry_time: string
}

export const fetchTransactionStatus = async (
  orderId: string,
): Promise<TypeResponseStatus> => {
  return new Promise((resolve, reject) => {
    axios
      .get<TypeResponseStatus>(
        `${process.env.PAYMENTGATEWAYSTATUSURL ?? ''}/${orderId}/status`,
        {
          headers: {
            Authorization: 'Basic ' + btoa(process.env.SERVERKEY ?? '' + ':'),
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        },
      )
      .then(res => {
        resolve(res.data as TypeResponseStatus)
      })
      .catch(err => {
        reject(err)
      })
  })
}
