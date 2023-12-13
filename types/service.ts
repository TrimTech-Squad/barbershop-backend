export type SERVICE = {
  id?: number
  serviceName: string
  description: string
  isActive: ISACTIVESTATUS
}

export enum ISACTIVESTATUS {
  INACTIVE = 'Inactive',
  ACTIVE = 'Active',
}

export type SERVICE_KAPSTER = {
  id?: number
  kapsterId: number
  serviceId: number
  price: number
  isActive: ISACTIVESTATUS
}
