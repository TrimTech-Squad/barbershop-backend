import { NotFoundError } from '../helpers/error'
import { KAPSTER, KAPSTERSERVICE, KAPSTERSTATUS } from '../../types/kapster'
import { Kapster, Service, ServiceKapster } from '../../models'
import { SERVICE } from '../../types/service'

export default class KapsterServices {
  static createKapster = async (kapster: KAPSTER): Promise<KAPSTER> => {
    return new Promise((resolve, reject) => {
      Kapster.create(kapster)
        .then((data: KAPSTER) => {
          resolve(data)
        })
        .catch((err: Error) => {
          reject(err)
        })
    })
  }

  static getKapster = async (id: number): Promise<KAPSTER> => {
    return new Promise((resolve, reject) => {
      Kapster.findOne({
        where: { id },
      })
        .then((data: KAPSTER | null) => {
          if (data) {
            resolve(data)
          }
          reject(new NotFoundError('Kapster not found'))
        })
        .catch((err: Error) => {
          reject(err)
        })
    })
  }

  static updateKapster = async (
    id: number,
    kapster: KAPSTER,
  ): Promise<KAPSTER> => {
    return new Promise((resolve, reject) => {
      Kapster.update(kapster, {
        where: { id },
      })
        .then((data: [number, KAPSTER[]]) => {
          if (data[0]) {
            resolve(kapster)
          }
          reject(new NotFoundError('Kapster not found'))
        })
        .catch((err: Error) => {
          reject(err)
        })
    })
  }

  static deleteKapster = async (id: string): Promise<KAPSTER> => {
    return new Promise((resolve, reject) => {
      Kapster.destroy({
        where: { id },
      })
        .then((data: number) => {
          if (data) {
            resolve({} as KAPSTER)
          }
          reject(new NotFoundError('Kapster not found'))
        })
        .catch((err: Error) => {
          reject(err)
        })
    })
  }

  static getKapsters = async (admin: boolean = false): Promise<KAPSTER[]> => {
    return new Promise((resolve, reject) => {
      Kapster.findAll({
        where: admin ? {} : { status: KAPSTERSTATUS.AVAILABLE },
      })
        .then((data: KAPSTER[]) => {
          resolve(data)
        })
        .catch((err: Error) => {
          reject(err)
        })
    })
  }

  static getKapsterServices = async (
    id: number,
  ): Promise<({ price: number } & SERVICE)[]> => {
    return new Promise((resolve, reject) => {
      ServiceKapster.findAll({
        where: {
          kapsterId: id,
        },
        attributes: ['price'],
        include: [
          {
            model: Service,
            as: 'service',
          },
        ],
      })
        .then(
          (
            data: {
              service: {
                dataValues: SERVICE
              }
              price: number
            }[],
          ) => {
            resolve(
              data.map(item => {
                return {
                  ...item.service.dataValues,
                  price: item.price,
                }
              }),
            )
          },
        )
        .catch((err: Error) => {
          reject(err)
        })
    })
  }

  static createKapsterService = async (
    kapsterService: KAPSTERSERVICE,
  ): Promise<KAPSTERSERVICE> => {
    return new Promise((resolve, reject) => {
      ServiceKapster.create(kapsterService)
        .then((data: KAPSTERSERVICE) => {
          resolve(data)
        })
        .catch((err: Error) => {
          reject(err)
        })
    })
  }

  static updateKapsterService = async (
    id: number,
    kapsterService: KAPSTERSERVICE,
  ): Promise<KAPSTERSERVICE> => {
    return new Promise((resolve, reject) => {
      ServiceKapster.update(kapsterService, {
        where: { id },
      })
        .then((data: [number, KAPSTERSERVICE[]]) => {
          if (data[0]) {
            resolve(kapsterService)
          }
          reject(new NotFoundError('Service not found'))
        })
        .catch((err: Error) => {
          reject(err)
        })
    })
  }

  static deleteKapsterService = async (id: string): Promise<KAPSTERSERVICE> => {
    return new Promise((resolve, reject) => {
      ServiceKapster.destroy({
        where: { id },
      })
        .then((data: number) => {
          if (data) {
            resolve({} as KAPSTERSERVICE)
          }
          reject(new NotFoundError('Service not found'))
        })
        .catch((err: Error) => {
          reject(err)
        })
    })
  }
}
