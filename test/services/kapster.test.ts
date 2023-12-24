import KapsterServices from '../../src/services/kapster'
import { describe, it, expect } from 'vitest'
import {
  KAPSTER,
  KAPSTERGENDER,
  KAPSTERSERVICE,
  KAPSTERSTATUS,
} from '../../types/kapster'
import ServiceServices from '../../src/services/service'

describe('kapster services', () => {
  // Data kapster yang digunakan dalam pengujian
  const kapster: KAPSTER = {
    id: 1,
    name: 'kapster',
    gender: KAPSTERGENDER.MAN,
    specialization: 'specialization',
    status: KAPSTERSTATUS.AVAILABLE,
  }

  // Pengujian untuk membuat kapster baru
  it('should can create kapster', async () => {
    const data = await KapsterServices.createKapster(kapster)
    expect(data.name).toEqual(kapster.name)
    expect(data.gender).toEqual(kapster.gender)
    expect(data.specialization).toEqual(kapster.specialization)
  })

   // Pengujian untuk mendapatkan informasi kapster
  it('should get kapster info', async () => {
    const data = await KapsterServices.getKapster(1)
    expect(data.name).toEqual(kapster.name)
    expect(data.gender).toEqual(kapster.gender)
    expect(data.specialization).toEqual(kapster.specialization)
  })

  // Pengujian untuk mengecek bahwa error terjadi ketika kapster tidak ditemukan
  it('should throw error when kapster not found', async () => {
    await expect(KapsterServices.getKapster(-1)).rejects.toThrow(
      'Kapster not found',
    )
  })

  // Pengujian untuk memperbarui informasi kapster
  it('should can update kapster', async () => {
    const updateKapster: KAPSTER = {
      id: 1,
      name: 'kapster',
      gender: KAPSTERGENDER.MAN,
      specialization: 'specialization',
      status: KAPSTERSTATUS.AVAILABLE,
    }
    const data = await KapsterServices.updateKapster(
      updateKapster.id!,
      updateKapster,
    )
    expect(data.name).toEqual(updateKapster.name)
    expect(data.gender).toEqual(updateKapster.gender)
    expect(data.specialization).toEqual(updateKapster.specialization)
  })

  // Pengujian untuk menghapus kapster
  it('should can delete kapster', async () => {
    const data = await KapsterServices.deleteKapster(String(1))
    expect(data).toEqual({})
  })

  // Data layanan kapster yang digunakan dalam pengujian
  const kapsterService: KAPSTERSERVICE = {
    id: 1,
    kapsterId: 2,
    serviceId: 2,
    isActive: true,
    price: 10000,
  }

  // Pengujian untuk membuat layanan kapster baru
  it('should can create kapster service', async () => {
    try {
      await ServiceServices.createService({
        id: 2,
        serviceName: 'service',
        description: 'description',
        isActive: true,
      })
      await KapsterServices.createKapster({ ...kapster, id: 2 })
    } catch (err) {
      console.log(err)
    } finally {
      const data = await KapsterServices.createKapsterService(kapsterService)
      expect(data.kapsterId).toEqual(2)
      expect(data.serviceId).toEqual(2)
      expect(data.price).toEqual(10000)
    }
  })

  // Pengujian untuk mendapatkan informasi semua layanan kapster
  it('should get all kapster service info', async () => {
    const data = await KapsterServices.getKapsterServices(
      kapsterService.kapsterId,
    )

    // Memeriksa bahwa informasi layanan kapster sesuai dengan yang diharapkan
    data.forEach(kapsterService => {
      expect(kapsterService.serviceName).toEqual('service')
      expect(kapsterService.description).toEqual('description')
      expect(kapsterService.price).toEqual(10000)
    })
  })

  // Pengujian untuk memperbarui informasi layanan kapster
  it('should can update service', async () => {
    const updatedService: KAPSTERSERVICE = {
      id: 1,
      kapsterId: 2,
      serviceId: 2,
      isActive: true,
      price: 20000,
    }

    const data = await KapsterServices.updateKapsterService(
      updatedService.id!,
      updatedService,
    )

    expect(data.kapsterId).toEqual(updatedService.kapsterId)
    expect(data.serviceId).toEqual(updatedService.serviceId)
    expect(data.price).toEqual(updatedService.price)
  })

  // Pengujian untuk menghapus layanan kapster
  it('should can delete service', async () => {
    const data = await KapsterServices.deleteKapsterService(String(1))
    expect(data).toEqual({})
  })
})
