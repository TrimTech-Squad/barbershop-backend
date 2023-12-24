import { NotFoundError } from '../helpers/error'
import { KAPSTER, KAPSTERSERVICE, KAPSTERSTATUS } from '../../types/kapster'
import { Kapster, Service, ServiceKapster } from '../../models'
import { SERVICE } from '../../types/service'

export default class KapsterServices {
  // membuat kapster baru
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

  // mendapatkan informasi kapster berdasarkan ID.
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

  // mengupdate informasi kapster berdasarkan ID.
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

  // menghapus kapster berdasarkan ID.
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

  // mendapatkan daftar kapster.
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

  // mendapatkan informasi layanan yang diberikan oleh seorang kapster berdasarkan ID.
  static getKapsterServiceById = async (
    id: number,
  ): Promise<KAPSTERSERVICE & { service: SERVICE }> => {
    return new Promise((resolve, reject) => {
      ServiceKapster.findOne({
        where: { id },
        include: [
          {
            model: Service,
            as: 'service',
          },
        ],
      })
        .then((data: KAPSTERSERVICE & { service: SERVICE }) => {
          if (data) {
            return resolve(data)
          }
          reject(new NotFoundError('KapsterService not found'))
        })
        .catch((err: Error) => {
          reject(err)
        })
    })
  }

  // mendapatkan daftar layanan yang diberikan oleh seorang kapster berdasarkan ID.
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

  // membuat layanan baru yang diberikan oleh seorang kapster.
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

  // mengupdate informasi layanan yang diberikan oleh seorang kapster berdasarkan ID.
  static updateKapsterService = async (
    id: number,
    kapsterService: KAPSTERSERVICE,
  ): Promise<KAPSTERSERVICE> => {
    return new Promise((resolve, reject) => {
      ServiceKapster.findOne({
        where: { id },
      })
        .then(
          (
            data:
              | (KAPSTERSERVICE & { save: () => Promise<KAPSTERSERVICE> })
              | null,
          ) => {
            if (!data) return reject(new NotFoundError('Service not found'))

            data.price = Math.round(kapsterService.price)
            data.isActive = kapsterService.isActive

            data
              .save()
              .then((data: KAPSTERSERVICE) => {
                resolve(data)
              })
              .catch((err: Error) => {
                reject(err)
              })
          },
        )
        .catch((err: Error) => {
          reject(err)
        })
    })
  }

  // menghapus layanan yang diberikan oleh seorang kapster berdasarkan ID.
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
