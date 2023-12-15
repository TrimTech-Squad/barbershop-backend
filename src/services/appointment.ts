import { Appointment } from '../../models'
import { APPOINTMENT, APPOINTMENTSTATUS } from '../../types/appointment'
import { NotFoundError } from '../helpers/error'
import { appointmentIdMaker } from '../utils/id_maker'

export default class AppointmentService {
  static async createAppointment(appointment: APPOINTMENT) {
    appointment.status = APPOINTMENTSTATUS.BOOKED
    appointment.date = new Date().toISOString()
    appointment.id = appointmentIdMaker((await this.getAppointmentCounts()) + 1)
    return await Appointment.create(appointment)
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
