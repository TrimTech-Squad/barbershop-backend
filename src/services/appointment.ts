import { Appointment } from '../../models'
import { APPOINTMENT, APPOINTMENTSTATUS } from '../../types/appointment'
import { NotFoundError } from '../helpers/error'
import { appointmentIdMaker } from '../utils/id_maker'

export default class AppointmentService {
  static async createAppointment(appointment: APPOINTMENT) {
    appointment.status = APPOINTMENTSTATUS.BOOKED
    appointment.id = appointmentIdMaker((await this.getAppointmentCounts()) + 1)
    return await Appointment.create(appointment)
  }

  static async getAppointment(id: string) {
    const appointment = await Appointment.findOne({ where: { id } })
    if (!appointment) throw new NotFoundError('Appointment not found')
    return appointment
  }

  static async updateAppointment(id: string, appointment: APPOINTMENT) {
    const updateAppointment = await Appointment.findByPk(id)
    if (!updateAppointment) throw new NotFoundError('Appointment not found')
    return await updateAppointment.update(appointment)
  }

  // static async deleteAppointment(id: string) {
  //   const appointment = await Appointment.findByPk(id)
  //   if (!appointment) throw new NotFoundError('Appointment not found')
  //   await appointment.destroy()
  //   return true
  // }

  static async getAppointmentByUserId(userId: number): Promise<APPOINTMENT[]> {
    return await Appointment.findAll({ where: { userId } })
  }

  static async getAppointmentCounts() {
    return await Appointment.count()
  }
}
