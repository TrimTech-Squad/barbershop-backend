import { Kapster, Service, ServiceKapster } from '../../models'
import { KAPSTER, KAPSTERSERVICE } from '../../types/kapster'
import { SERVICE } from '../../types/service'
import { NotFoundError } from '../helpers/error'

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

  static getAllServices = async (query?: 'ALL'): Promise<SERVICE[]> => {
    return new Promise((resolve, reject) => {
      Service.findAll({
        where: query === 'ALL' ? {} : { isActive: true },
      })
        .then((data: SERVICE[]) => {
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

  static async getKapsterService(
    id: number,
  ): Promise<KAPSTERSERVICE & { service: SERVICE; kapster: KAPSTER }> {
    return new Promise((resolve, reject) => {
      ServiceKapster.findOne({
        where: { id },
        include: [
          {
            model: Service,
            as: 'service',
          },
          {
            model: Kapster,
            as: 'kapster',
          },
        ],
      })
        .then(
          (data: KAPSTERSERVICE & { service: SERVICE; kapster: KAPSTER }) => {
            if (data) {
              resolve(data)
            }
            reject(new NotFoundError('Kapster Service not found'))
          },
        )
        .catch((err: Error) => {
          reject(err)
        })
    })
  }

  //   static deleteService = async (id: string): Promise<SERVICE> => {
  //     return new Promise((resolve, reject) => {
  //       Service.destroy({
  //         where: { id },
  //       })
  //         .then((data: number) => {
  //           if (data) {
  //             resolve({} as SERVICE)
  //           }
  //           reject(new NotFoundError('Service not found'))
  //         })
  //         .catch((err: Error) => {
  //           reject(err)
  //         })
  //     })
  //   }
}
