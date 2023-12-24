export enum APPOINTMENTSTATUS {
  BOOKED = 'Booked',
  COMPLETED = 'Completed',
  CANCELLED = 'Cancelled',
}

// Tipe data untuk merepresentasikan informasi janji temu
export type APPOINTMENT = {
  id?: string
  userId: number
  kapsterServiceId: number
  orderId: string
  date: string
  time: string
  status: APPOINTMENTSTATUS
}
