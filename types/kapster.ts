export enum KAPSTERGENDER {
  MAN = 'Man',
  WOMAN = 'Woman',
}

export type KAPSTERSERVICE = {
  kapsterId: number
  serviceId: number
  price: number
}

export type KAPSTER = {
  id?: number
  name: string
  gender: KAPSTERGENDER
  specialization: string
}
