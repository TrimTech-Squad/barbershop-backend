// Enum untuk jenis kelamin kapster
export enum KAPSTERGENDER {
  MAN = 'Man',
  WOMAN = 'Woman',
}

// Enum untuk status kapster
export enum KAPSTERSTATUS {
  AVAILABLE = 'Available',
  UNAVAILABLE = 'Unavailable',
  RESIGNED = 'Resigned',
}

// Tipe data untuk layanan yang dapat diberikan oleh kapster
export type KAPSTERSERVICE = {
  id?: number
  kapsterId: number
  serviceId: number
  price: number
  isActive: boolean
}

// Tipe data untuk informasi kapster
export type KAPSTER = {
  id?: number
  name: string
  gender: KAPSTERGENDER
  specialization: string
  status: KAPSTERSTATUS
}
