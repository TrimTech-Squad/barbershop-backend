import axios from 'axios'
import dotenv from 'dotenv'
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

export const fetchTransactionToken = async (
  data: TransactionRequest,
): Promise<SnapResponse> => {
  const requestObject = {
    ...data,
    expiry: {
      start_time: getDateFormated(new Date()),
      unit: 'day',
      duration: 1,
    },
    page_expiry: {
      duration: 2,
      unit: 'hours',
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
