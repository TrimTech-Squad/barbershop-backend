import { Appointment, Kapster, Service, User } from '../../models'
import { APPOINTMENT, APPOINTMENTSTATUS } from '../../types/appointment'
import { NotFoundError } from '../helpers/error'
import fetchTransactionToken from '../payments'
import { appointmentIdMaker } from '../utils/id_maker'

export default class AppointmentService {
  static async createAppointment(appointment: APPOINTMENT) {
    appointment.status = APPOINTMENTSTATUS.BOOKED
    appointment.date = new Date().toISOString()
    appointment.id = appointmentIdMaker((await this.getAppointmentCounts()) + 1)
    return await Appointment.create(appointment)
  }

  static async createAppointmentPaymentToken({
    userId,
    kapsterId,
    serviceId,
  }: {
    userId: number
    kapsterId: number
    serviceId: number
  }) {
    const user = await User.findOne({ where: { id: userId } })
    if (!user) throw new NotFoundError('User not found')
    const kapster = await Kapster.findOne({ where: { id: kapsterId } })
    if (!kapster) throw new NotFoundError('Kapster not found')
    const service = await Service.findOne({ where: { id: serviceId } })
    if (!service) throw new NotFoundError('Service not found')

    const requestPayment = await fetchTransactionToken({
      customer_details: {
        email: user.email,
        first_name: user.name,
        last_name: user.name,
        phone: user.number,
      },
      item_details: [
        {
          id: service.id.toString(),
          name: service.serviceName,
          price: service.price,
          merchant_name: 'TrimTech',
          url: 'https://trimtech.id',
        },
      ],
      transaction_details: {
        order_id: appointmentIdMaker((await this.getAppointmentCounts()) + 1),
        gross_amount: service.price,
      },
    })

    return requestPayment
  }

  static async getAppointment(id: string, userId: number) {
    const appointment = await Appointment.findOne({ where: { id, userId } })
    if (!appointment) throw new NotFoundError('Appointment not found')
    return appointment
  }

  static async updateAppointment(
    id: string,
    userId: number,
    appointment: { status: APPOINTMENTSTATUS; time: string },
  ) {
    const updateAppointment = await Appointment.findOne({
      where: { id, userId },
    })
    if (!updateAppointment) throw new NotFoundError('Appointment not found')
    return await updateAppointment.update(appointment)
  }

  // static async deleteAppointment(id: string) {
  //   const appointment = await Appointment.findByPk(id)
  //   if (!appointment) throw new NotFoundError('Appointment not found')
  //   await appointment.destroy()
  //   return true
  // }

  static async getAllAppointments(
    offset = 0,
    limit = 0,
    status: APPOINTMENTSTATUS,
  ): Promise<APPOINTMENT[]> {
    if (isNaN(offset) || isNaN(limit)) {
      limit = 10
      offset = 0
    }
    return await Appointment.findAll({
      where: status ? { status } : {},
      offset,
      limit,
    })
  }

  static async getAppointmentByUserId(userId: number): Promise<APPOINTMENT[]> {
    return await Appointment.findAll({ where: { userId } })
  }

  static async getAppointmentCounts() {
    return await Appointment.count()
  }
}
