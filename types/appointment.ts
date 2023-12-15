export enum APPOINTMENTSTATUS {
  BOOKED = 'Booked',
  COMPLETED = 'Completed',
  CANCELLED = 'Cancelled',
}

export type APPOINTMENT = {
  id?: string
  userId: number
  kapsterServiceId: number
  orderId: string
  date: string
  time: string
  status: APPOINTMENTSTATUS
}
