import { Appointment } from '../../models'
import { APPOINTMENT } from '../../types/appointment'
import { NotFoundError } from '../helpers/error'

export default class AppointmentService {
  static async createAppointment(appointment: APPOINTMENT) {
    return await Appointment.create(appointment)
  }

  static async getAppointment(id: number) {
    const appointment = await Appointment.findByPk(id)
    if (!appointment) throw new NotFoundError('Appointment not found')
    return appointment
  }

  static async updateAppointment(id: number, appointment: APPOINTMENT) {
    const updateAppointment = await Appointment.findByPk(id)
    if (!updateAppointment) throw new NotFoundError('Appointment not found')
    return await updateAppointment.update(appointment)
  }

  static async deleteAppointment(id: string) {
    const appointment = await Appointment.findByPk(id)
    if (!appointment) throw new NotFoundError('Appointment not found')
    await appointment.destroy()
    return {}
  }

  static async getAppointmentByUserId(userId: number): Promise<APPOINTMENT[]> {
    return await Appointment.findAll({ where: { userId } })
  }
}
