import axios from 'axios'
import dotenv from 'dotenv'

dotenv.config()
export type SnapResponse = {
  token: string
  redirect_url: string
}

export type TransactionDetails = {
  order_id: string
  gross_amount: number
}

export type ItemDetails = {
  id: string
  price: number
  name: string
  //   brand: 'TrimTech'
  //   category: string
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

export const fetchTransactionToken = async (
  data: TransactionRequest,
): Promise<SnapResponse> => {
  const requestObject = {
    ...data,
    expiry: {
      start_time: new Date().toISOString(),
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
      }>('http://localhost:3000/api/payments', JSON.stringify(requestObject), {
        headers: {
          Authorization: 'Basic ' + process.env.MIDTRANSERVERSTOKEN,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      })
      .then(res => {
        resolve(res.data)
      })
      .catch(err => {
        reject(err)
      })
  })
}

export default fetchTransactionToken
