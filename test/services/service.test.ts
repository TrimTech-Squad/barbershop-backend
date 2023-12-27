import ServiceServices from '../../src/services/service'
import { describe, it, expect } from 'vitest'

describe('service services', () => {
  const service = {
    id: Math.floor(Math.random() * 100),
    serviceName: 'service',
    description: 'description',
    isActive: true,
  }

  it('should can create service', async () => {
    const data = await ServiceServices.createService(service)
    expect(data.serviceName).toEqual(service.serviceName)
    expect(data.description).toEqual(service.description)
  })

  it('should get all service info', async () => {
    const data = await ServiceServices.getAllServices()
    expect(data).toBeInstanceOf(Array)
  })

  // it('should throw error when service not found', async () => {
  //   await expect(
  //     ServiceServices.getServiceAndKaptserAvailable(-1),
  //   ).rejects.toThrow('Service not found')
  // })

  it('should can update service', async () => {
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
