export type USER = {
  id?: number
  email: string
  password: string
  name: string
  photo_url: string
  number: string
  role: USERROLE
}

export enum USERROLE {
  CUSTOMER = 'Customer',
  ADMIN = 'Admin',
}

export type USERTOKENOBJECT = {
  id: string
  email: string
}
