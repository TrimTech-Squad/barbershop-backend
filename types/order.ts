export enum TRANSACTION_STATUS {
  PENDING = 'pending',
  SETTLEMENT = 'settlement',
  CANCEL = 'cancel',
  DENY = 'deny',
  EXPIRE = 'expire',
  REFUND = 'refund',
  PARTIAL_REFUND = 'partial_refund',
  AUTHORIZE = 'authorize',
  CAPTURE = 'capture',
  CHARGEBACK = 'chargeback',
  FAILURE = 'failure',
}

export enum FRAUD_STATUS {
  ACCEPT = 'accept',
  DENY = 'deny',
}

export type ORDER = {
  id?: string
  kapsterServiceId: number
  userId: number
  gross_amount: number
  booking_time: string
  token: string
  redirect_url: string
  transaction_id?: string
  transaction_status?: TRANSACTION_STATUS
  expiry_time?: string
  transaction_time?: string
  payment_type?: string
  currency?: string
  signature_key?: string | null
  fraud_status?: FRAUD_STATUS
  merchant_id?: string
  store?: string
  refund_amount?: number
  refund_key?: string
  refund_reason?: string
  createdAt?: string
}
