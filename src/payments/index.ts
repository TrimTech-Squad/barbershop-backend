import axios from 'axios'
import dotenv from 'dotenv'
import { FRAUD_STATUS, TRANSACTION_STATUS } from '../../types/order'
dotenv.config()

// Definisi tipe data untuk respons Snap API dari Midtrans.
export type SnapResponse = {
  token: string
  redirect_url: string
  gross_amount: number
  order_id: string
}

// Definisi tipe data untuk detail transaksi.
export type TransactionDetails = {
  order_id: string
  gross_amount: number
}

// Definisi tipe data untuk detail item yang akan dibeli.
export type ItemDetails = {
  id: string | number
  price: number
  name: string
  quantity: number
  merchant_name: 'TrimTech'
  url: string
}[]

// Definisi tipe data untuk detail pelanggan.
export type CustomerDetails = {
  first_name: string
  last_name: string
  email: string
  phone: string
}

// Definisi tipe data untuk permintaan transaksi.
export type TransactionRequest = {
  transaction_details: TransactionDetails
  item_details: ItemDetails
  customer_details: CustomerDetails
}

// Fungsi untuk memformat tanggal
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

// Metode pembayaran yang diizinkan
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

// Fungsi untuk meminta token pembayaran (Snap)
export const fetchTransactionToken = async (
  data: TransactionRequest,
): Promise<SnapResponse> => {
  const formatedDate = getDateFormated(new Date())

  // Objek permintaan dengan berbagai detail
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

  // Mengembalikan janji (Promise) hasil dari permintaan POST ke API pembayaran
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
        // Resolve janji dengan data hasil response, termasuk gross_amount dan order_id dari data awal
        resolve({
          ...res.data,
          gross_amount: data.transaction_details.gross_amount,
          order_id: data.transaction_details.order_id,
        })
      })
      .catch(err => {
        // Reject janji jika terjadi kesalahan
        reject(err)
      })
  })
}

// Ekspor fungsi fetchTransactionToken sebagai default
export default fetchTransactionToken

// Definisi tipe data untuk respons status transaksi
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

// Fungsi untuk meminta status transaksi berdasarkan order_id
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

// Fungsi untuk membatalkan transaksi berdasarkan order_id
export const fetchTransactionCancel = async (
  orderId: string,
): Promise<TypeResponseStatus> => {
  return new Promise((resolve, reject) => {
    axios
      .get<TypeResponseStatus>(
        `${process.env.PAYMENTGATEWAYSTATUSURL ?? ''}/${orderId}/cancel`,
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

// Definisi tipe data untuk respons refund transaksi
export type TypeResponseRefund = {
  status_code: string
  status_message: string
  transaction_id: string
  order_id: string
  payment_type: string
  transaction_time: string
  transaction_status: TRANSACTION_STATUS
  gross_amount: string
  refund_chargeback_id: number
  refund_amount: string
  refund_key: string
}

// Fungsi untuk meminta refund transaksi berdasarkan order_id, jumlah, dan alasan
export const fetchTransactionRefund = async (
  orderId: string,
  { amount, reason }: { amount: number; reason: string },
): Promise<TypeResponseRefund> => {
  return new Promise((resolve, reject) => {
    axios
      .post<TypeResponseRefund>(
        `${process.env.PAYMENTGATEWAYSTATUSURL ?? ''}/${orderId}/refund`,
        JSON.stringify({ amount, reason }),
        {
          headers: {
            Authorization: 'Basic ' + btoa(process.env.SERVERKEY ?? '' + ':'),
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        },
      )
      .then(res => {
        resolve(res.data as TypeResponseRefund)
      })
      .catch(err => {
        reject(err)
      })
  })
}
