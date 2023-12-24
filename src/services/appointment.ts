import { Appointment } from '../../models'
import { APPOINTMENT, APPOINTMENTSTATUS } from '../../types/appointment'
import { NotFoundError } from '../helpers/error'
import { appointmentIdMaker } from '../utils/id_maker'

export default class AppointmentService {
  static async createAppointment(appointment: APPOINTMENT) {
    // Mengatur status appointment sebagai 'BOOKED', menetapkan tanggal saat ini, dan
    // menghasilkan ID appointment menggunakan fungsi appointmentIdMaker.
    appointment.status = APPOINTMENTSTATUS.BOOKED
    appointment.date = new Date().toISOString()
    appointment.id = appointmentIdMaker((await this.getAppointmentCounts()) + 1)
    // Membuat appointment baru menggunakan model Appointment.
    return await Appointment.create(appointment)
  }

  // Metode untuk mendapatkan detail appointment berdasarkan ID dan userID.
  static async getAppointment(id: string, userId: number) {

     // Mencari appointment berdasarkan ID dan userID.
    const appointment = await Appointment.findOne({ where: { id, userId } })

    // Jika tidak ditemukan, lemparkan NotFoundError.
    if (!appointment) throw new NotFoundError('Appointment not found')
    return appointment
  }

  // mengupdate appointment berdasarkan ID dan userID.
  static async updateAppointment(
    id: string,
    userId: number,
    appointment: { status: APPOINTMENTSTATUS; time: string },
  ) {
    // Mencari appointment yang akan diupdate berdasarkan ID dan userID.
    const updateAppointment = await Appointment.findOne({
      where: { id, userId },
    })

    // Jika tidak ditemukan, lemparkan NotFoundError.
    if (!updateAppointment) throw new NotFoundError('Appointment not found')

    // Melakukan update pada appointment dan mengembalikan hasilnya.
    return await updateAppointment.update(appointment)
  }

  // Mendapatkan daftar appointments dengan opsi offset, limit, dan status tertentu.
  static async getAllAppointments(
    offset = 0,
    limit = 0,
    status: APPOINTMENTSTATUS,
  ): Promise<APPOINTMENT[]> {

    // Jika offset atau limit tidak valid, diatur nilai default.
    if (isNaN(offset) || isNaN(limit)) {
      limit = 10
      offset = 0
    }

    // Mengambil semua appointments berdasarkan status, offset, dan limit.
    return await Appointment.findAll({
      where: status ? { status } : {},
      offset,
      limit,
    })
  }

  // mendapatkan daftar appointments berdasarkan userID.
  static async getAppointmentByUserId(userId: number): Promise<APPOINTMENT[]> {
    return await Appointment.findAll({ where: { userId } })
  }

  // mendapatkan jumlah total appointments.
  static async getAppointmentCounts() {
    return await Appointment.count()
  }
}
