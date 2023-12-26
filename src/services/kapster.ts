import { NotFoundError } from '../helpers/error'
import { KAPSTER, KAPSTERSERVICE, KAPSTERSTATUS } from '../../types/kapster'
import { Appointment, Kapster, Service, ServiceKapster } from '../../models'
import { SERVICE } from '../../types/service'
import { APPOINTMENT, APPOINTMENTSTATUS } from '../../types/appointment'
import { Op } from 'sequelize'

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

  static getAllKapsters = async (): Promise<KAPSTER[]> => {
    return new Promise((resolve, reject) => {
      Kapster.findAll()
        .then((data: KAPSTER[]) => {
          resolve(data)
        })
        .catch((err: Error) => {
          reject(err)
        })
    })
  }

  static getKapsters = async (
    admin: boolean = false,
    activeServices = false,
  ): Promise<KAPSTER[]> => {
    return new Promise((resolve, reject) => {
      Kapster.findAll({
        where: admin ? {} : { status: KAPSTERSTATUS.AVAILABLE },
        include: [
          {
            model: ServiceKapster,
            as: 'services',
            attributes: ['price', 'id'],
            where: activeServices ? { isActive: true } : {},
            include: [
              {
                model: Service,
                as: 'service',
                where: activeServices ? { isActive: true } : {},
                attributes: ['serviceName', 'id'],
              },
            ],
          },
        ],
      })
        .then(
          (
            data: (KAPSTER & {
              services: (KAPSTERSERVICE & {
                service: { serviceName: string; id: number }
              })[]
            })[],
          ) => {
            resolve(
              data.map(kapster => {
                return {
                  id: kapster.id,
                  name: kapster.name,
                  gender: kapster.gender,
                  status: kapster.status,
                  specialization: kapster.specialization,
                  photo_url: kapster.photo_url,
                  services: kapster.services.map(serviceKapster => {
                    return {
                      serviceKapsterid: serviceKapster.id,
                      id: serviceKapster.service.id,
                      name: serviceKapster.service.serviceName,
                      price: serviceKapster.price,
                    }
                  }),
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

  static getAllKapsterScheduleByIdAndDate = async (
    id: number,
    date: Date,
  ): Promise<unknown> => {
    const begin = new Date(date)
    const end = new Date(begin.getTime() + 86400000)

    return new Promise((resolve, reject) => {
      ServiceKapster.findAll({
        include: [
          {
            model: Kapster,
            as: 'kapster',
            where: { status: KAPSTERSTATUS.AVAILABLE, id },
          },
          {
            model: Appointment,
            as: 'appointments',
            where: {
              time: {
                [Op.between]: [begin, end],
              },
              status: APPOINTMENTSTATUS.BOOKED,
            },
          },
        ],
      })
        .then(
          async (
            data: (KAPSTERSERVICE & {
              kapster: KAPSTER
              appointments: APPOINTMENT[]
            })[],
          ) => {
            try {
              const mappedData: Record<string, string> = {}
              for (const service of data) {
                for (const appointment of service.appointments) {
                  const date = new Date(appointment.time)
                  const hour =
                    date.getHours() < 10
                      ? '0' + date.getHours()
                      : date.getHours().toString()
                  const minute =
                    date.getMinutes() < 10
                      ? '0' + date.getMinutes()
                      : date.getMinutes().toString()
                  mappedData[`${hour}:${minute}`] = `${hour}:${minute}`
                }
              }
              resolve(mappedData)
            } catch (err) {
              reject(err)
            }
          },
        )
        .catch((err: Error) => {
          reject(err)
        })
    })
  }

  static getKapsterServices = async (
    id: number | null = null,
  ): Promise<
    {
      service: {
        dataValues: SERVICE
      }
      kapster: {
        dataValues: KAPSTER
      }
      price: number
      id: number
      isActive: boolean
    }[]
  > => {
    return new Promise((resolve, reject) => {
      ServiceKapster.findAll({
        where: id ? { kapsterId: id } : {},
        attributes: ['price', 'id', 'isActive'],
        include: [
          {
            model: Service,
            as: 'service',
            attributes: ['serviceName', 'id'],
          },
          {
            model: Kapster,
            as: 'kapster',
            attributes: ['name', 'id', 'gender'],
          },
        ],
      })
        .then(
          (
            data: {
              service: {
                dataValues: SERVICE
              }
              kapster: {
                dataValues: KAPSTER
              }
              price: number
              id: number
              isActive: boolean
            }[],
          ) => {
            resolve(data)
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
