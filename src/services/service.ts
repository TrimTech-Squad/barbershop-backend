import { Op } from 'sequelize'
import { Appointment, Kapster, Service, ServiceKapster } from '../../models'
import { KAPSTER, KAPSTERSERVICE, KAPSTERSTATUS } from '../../types/kapster'
import { SERVICE } from '../../types/service'
import { NotFoundError } from '../helpers/error'
import { APPOINTMENT } from '../../types/appointment'
// import { Op } from 'sequelize'

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

  static getServiceAndKaptserAvailable = async (
    id: number,
  ): Promise<
    {
      kapster: string
      price: number
      status: KAPSTERSTATUS
    }[]
  > => {
    return new Promise((resolve, reject) => {
      ServiceKapster.findAll({
        where: { serviceId: id },
        include: [
          {
            model: Kapster,
            as: 'kapster',
            where: { status: KAPSTERSTATUS.AVAILABLE },
          },
        ],
      })
        .then(async (data: (KAPSTERSERVICE & { kapster: KAPSTER })[]) => {
          const date = new Date()
          const bookingEndDate = new Date(date.getTime() + 30 * 60 * 1000)
          try {
            const foundAppointment = (await Appointment.findAll({
              where: {
                time: {
                  [Op.between]: [date, bookingEndDate],
                },
              },
              include: {
                model: ServiceKapster,
                as: 'kapster',
                where: {
                  id: data.map(e => e.id),
                },
              },
            })) as APPOINTMENT[]

            const filteredData = data.filter(
              e => !foundAppointment.find(f => f.kapsterServiceId === e.id),
            )

            const mappedData = filteredData.map(e => {
              return {
                kapster: e.kapster.name,
                price: e.price,
                status: e.kapster.status,
              }
            })

            resolve(mappedData)
          } catch (err) {
            reject(err)
          }
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
