export type USER = {
  id: string
  email: string
  password: string
  firstName: string
  lastName: string
  role: ROLE
}

export enum USERROLE {
  CUSTOMER = 'Customer',
  ADMIN = 'Admin',
}

export type USERTOKENOBJECT = {
  id: string
  email: string
}
