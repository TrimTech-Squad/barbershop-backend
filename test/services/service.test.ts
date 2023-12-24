import ServiceServices from '../../src/services/service'
import { describe, it, expect } from 'vitest'

describe('service services', () => {
  // Membuat objek service yang akan digunakan dalam pengujian
  const service = {
    id: 1,
    serviceName: 'service',
    description: 'description',
    isActive: true,
  }

  // Mengecek apakah layanan dapat dibuat (createService)
  it('should can create service', async () => {

    // Memanggil fungsi createService dari ServiceServices dengan objek service
    const data = await ServiceServices.createService(service)

    // Memeriksa apakah hasil pemanggilan memiliki properti serviceName yang sesuai
    expect(data.serviceName).toEqual(service.serviceName)
    expect(data.description).toEqual(service.description)
  })

  // Mengecek apakah informasi layanan dapat diperoleh (getService)
  it('should get service info', async () => {

    // Memanggil fungsi getService dari ServiceServices dengan ID layanan 1
    const data = await ServiceServices.getService(1)
    expect(data.serviceName).toEqual(service.serviceName)
    expect(data.description).toEqual(service.description)
  })

  // Mengecek apakah error dilemparkan ketika layanan tidak ditemukan (getService)
  it('should throw error when service not found', async () => {
    await expect(ServiceServices.getService(-1)).rejects.toThrow(
      'Service not found',
    )
  })

  // Mengecek apakah layanan dapat diperbarui (updateService)
  it('should can update service', async () => {
    // Membuat objek updatedService yang berisi pembaruan informasi layanan
    const updatedService = {
      id: 1,
      serviceName: 'service updated',
      description: 'description',
      isActive: false,
    }

    const data = await ServiceServices.updateService(
      updatedService.id,
      updatedService,
    )

    expect(data.serviceName).toEqual(updatedService.serviceName)
    expect(data.description).toEqual(updatedService.description)
  })

  // it('should can delete service', async () => {
  //   const data = await ServiceServices.deleteService(String(1))
  //   expect(data).toEqual({})
  // })
})
