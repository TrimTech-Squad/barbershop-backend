import AppointmentService from '../../src/services/appointment'
import { describe, it, expect } from 'vitest'
import { APPOINTMENT, APPOINTMENTSTATUS } from '../../types/appointment'
import UserServices from '../../src/services/user'
import { USER, USERROLE } from '../../types/user'

describe('appointment services', () => {
  const appointment: APPOINTMENT = {
    id: 1,
    userId: 0,
    kapsterId: 2,
    serviceId: 2,
    date: '2021-01-01T00:00:00.000Z',
    time: new Date().toISOString(),
    status: APPOINTMENTSTATUS.BOOKED,
  }
  it('should can create appointment', async () => {
    try {
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
      const data = await AppointmentService.createAppointment(appointment)
      expect(data.userId).toEqual(appointment.userId)
      expect(data.kapsterId).toEqual(appointment.kapsterId)
      expect(data.serviceId).toEqual(appointment.serviceId)
      expect(new Date(data.date)).toBeInstanceOf(Date)
      expect(new Date(data.time)).toBeInstanceOf(Date)
      expect(data.status).toEqual(appointment.status)
    }
  })
  it('should get appointment info', async () => {
    const data = await AppointmentService.getAppointment(appointment.id!)
    expect(data.userId).toEqual(appointment.userId)
    expect(data.kapsterId).toEqual(appointment.kapsterId)
    expect(data.serviceId).toEqual(appointment.serviceId)
    expect(new Date(data.date)).toBeInstanceOf(Date)
    expect(new Date(data.time)).toBeInstanceOf(Date)
    expect(data.status).toEqual(appointment.status)
  })
  it('should update appointment info', async () => {
    const data = await AppointmentService.updateAppointment(appointment.id!, {
      ...appointment,
      status: APPOINTMENTSTATUS.COMPLETED,
    })
    expect(data.userId).toEqual(appointment.userId)
    expect(data.kapsterId).toEqual(appointment.kapsterId)
    expect(data.serviceId).toEqual(appointment.serviceId)
    expect(new Date(data.date)).toBeInstanceOf(Date)
    expect(new Date(data.time)).toBeInstanceOf(Date)
    expect(data.status).toEqual(APPOINTMENTSTATUS.COMPLETED)
  })
  it('should get appointment by user id', async () => {
    const data = await AppointmentService.getAppointmentByUserId(0)
    data.forEach(appointment => {
      expect(appointment.id).toEqual(1)
      expect(appointment.userId).toEqual(0)
    })
  })
  it('should delete appointment', async () => {
    const data = await AppointmentService.deleteAppointment('1')
    expect(data).toEqual({})
  })
})
