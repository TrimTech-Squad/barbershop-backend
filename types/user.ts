// Tipe data USER merepresentasikan informasi mengenai pengguna dalam sistem
export type USER = {
  id?: number
  email: string
  password?: string
  name: string
  photo_url: string
  number: string
  role: USERROLE
}

// Enum USERROLE mendefinisikan peran atau jabatan pengguna 
export enum USERROLE {
  CUSTOMER = 'Customer',
  ADMIN = 'Admin',
}

// Tipe data USERTOKENOBJECT merepresentasikan informasi yang disertakan dalam token pengguna
export type USERTOKENOBJECT = {
  id: number
  email: string
}
