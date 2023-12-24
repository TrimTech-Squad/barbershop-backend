import AppointmentService from '../../src/services/appointment'
import { describe, it, expect } from 'vitest'
import { APPOINTMENT, APPOINTMENTSTATUS } from '../../types/appointment'
import UserServices from '../../src/services/user'
import { USER, USERROLE } from '../../types/user'
import { appointmentIdMaker } from '../../src/utils/id_maker'

describe('appointment services', async () => {
  // Data janji temu yang digunakan untuk pengujian
  const appointment: APPOINTMENT = {
    id: appointmentIdMaker(
      (await AppointmentService.getAppointmentCounts()) + 1,
    ),
    userId: 0,
    kapsterServiceId: 10,
    orderId: 'ORDER-00000000001',
    date: '2021-01-01T00:00:00.000Z',
    time: new Date().toISOString(),
    status: APPOINTMENTSTATUS.BOOKED,
  }
  //// Pengujian untuk mencoba membuat janji temu
  it('should can create appointment', async () => {
    try {
      // Membuat pengguna (user) yang terlibat dalam janji temu
      const userCtx: USER = {
        id: 0,
        email: 'nishi@gmail.com',
        password: '12345678',
        role: USERROLE.CUSTOMER,
        name: 'nishi',
        photo_url: '',
        number: '08123456789',
      }
      await UserServices.createUser(userCtx)
    } catch (e) {
      null
    } finally {
      // Membuat janji temu dan menguji apakah data yang dibuat sesuai dengan harapan
      const data = await AppointmentService.createAppointment(appointment)
      expect(data.userId).toEqual(appointment.userId)
      expect(data.kapsterServiceId).toEqual(appointment.kapsterServiceId)
      expect(new Date(data.date)).toBeInstanceOf(Date)
      expect(new Date(data.time)).toBeInstanceOf(Date)
      expect(data.status).toEqual(appointment.status)
    }
  })

  // Pengujian untuk mendapatkan informasi janji temu
  it('should get appointment info', async () => {
    const data = await AppointmentService.getAppointment(appointment.id!, 0)
    expect(data.userId).toEqual(appointment.userId)
    expect(data.kapsterServiceId).toEqual(appointment.kapsterServiceId)
    expect(new Date(data.date)).toBeInstanceOf(Date)
    expect(new Date(data.time)).toBeInstanceOf(Date)
    expect(data.status).toEqual(appointment.status)
  })

  // Pengujian untuk memperbarui informasi janji temu
  it('should update appointment info', async () => {
    const data = await AppointmentService.updateAppointment(
      appointment.id!,
      0,
      {
        ...appointment,
        status: APPOINTMENTSTATUS.COMPLETED,
      },
    )
    expect(data.userId).toEqual(appointment.userId)
    expect(data.kapsterServiceId).toEqual(appointment.kapsterServiceId)
    expect(new Date(data.date)).toBeInstanceOf(Date)
    expect(new Date(data.time)).toBeInstanceOf(Date)
    expect(data.status).toEqual(APPOINTMENTSTATUS.COMPLETED)
  })

  // Pengujian untuk mendapatkan janji temu berdasarkan ID pengguna
  it('should get appointment by user id', async () => {
    const data = await AppointmentService.getAppointmentByUserId(
      appointment.userId!,
    )
    data.forEach(appointment => {
      expect(appointment.id).toEqual(appointment.id)
      expect(appointment.userId).toEqual(0)
    })
  })
  // it('should delete appointment', async () => {
  //   const data = await AppointmentService.deleteAppointment(appointment.id!)
  //   expect(data).toEqual(true)
  // })
})
