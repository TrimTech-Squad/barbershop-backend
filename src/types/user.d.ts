export type USER = {
  id: string
  email: string
  password: string
  phone_number: string
  role: ROLE
  createdAt: Date
  updatedAt: Date
}

export enum USERROLE {
  customer = 'customer',
  admin = 'admin',
}

export type USERTOKENOBJECT = {
  id: string
  email: string
}
