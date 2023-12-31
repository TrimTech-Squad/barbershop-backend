export enum APPOINTMENTSTATUS {
  BOOKED = 'Booked',
  COMPLETED = 'Completed',
  CANCELLED = 'Cancelled',
}

export type APPOINTMENT = {
  id?: number
  userId: number
  kapsterId: number
  serviceId: number
  date: string
  time: string
  status: APPOINTMENTSTATUS
}
