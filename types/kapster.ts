export enum KAPSTERGENDER {
  MAN = 'Man',
  WOMAN = 'Woman',
}

export enum KAPSTERSTATUS {
  AVAILABLE = 'Available',
  UNAVAILABLE = 'Unavailable',
  RESIGNED = 'Resigned',
}

export type KAPSTERSERVICE = {
  id?: number
  kapsterId: number
  serviceId: number
  price: number
  isActive: boolean
}

export type KAPSTER = {
  id?: number
  photo_url?: string
  name: string
  gender: KAPSTERGENDER
  specialization: string
  status: KAPSTERSTATUS
}
