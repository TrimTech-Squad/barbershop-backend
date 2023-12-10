import { Service } from '../../models'
import { SERVICE } from '../../types/service'
import { NotFoundError } from '../utils/error'

export default class ServiceServices {
  static createService = async (service: SERVICE): Promise<SERVICE> => {
    return new Promise((resolve, reject) => {
      Service.create(service)
        .then((data: SERVICE) => {
          resolve(data)
        })
        .catch((err: Error) => {
          reject(err)
        })
    })
  }

  static getService = async (id: number): Promise<SERVICE> => {
    return new Promise((resolve, reject) => {
      Service.findOne({
        where: { id },
      })
        .then((data: SERVICE | null) => {
          if (data) {
            resolve(data)
          }
          reject(new NotFoundError('Service not found'))
        })
        .catch((err: Error) => {
          reject(err)
        })
    })
  }

  static updateService = async (
    id: number,
    service: SERVICE,
  ): Promise<SERVICE> => {
    return new Promise((resolve, reject) => {
      Service.update(service, {
        where: { id },
      })
        .then((data: [number, SERVICE[]]) => {
          if (data[0]) {
            resolve(service)
          }
          reject(new NotFoundError('Service not found'))
        })
        .catch((err: Error) => {
          reject(err)
        })
    })
  }

  static deleteService = async (id: string): Promise<SERVICE> => {
    return new Promise((resolve, reject) => {
      Service.destroy({
        where: { id },
      })
        .then((data: number) => {
          if (data) {
            resolve({} as SERVICE)
          }
          reject(new NotFoundError('Service not found'))
        })
        .catch((err: Error) => {
          reject(err)
        })
    })
  }
}
