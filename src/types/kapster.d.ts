export enum KAPSTERGENDER {
  MAN = 'Man',
  WOMAN = 'Woman',
}

export type KAPSTER = {
  name: string
  gender: KAPSTERGENDER
  specialization: string
}
