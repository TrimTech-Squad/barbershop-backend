import ServiceServices from '../../src/services/service'
import { describe, it, expect } from 'vitest'

describe('service services', () => {
  const service = {
    id: 1,
    serviceName: 'service',
    description: 'description',
  }
  it('should can create service', async () => {
    const data = await ServiceServices.createService(service)
    expect(data.serviceName).toEqual(service.serviceName)
    expect(data.description).toEqual(service.description)
  })

  it('should get service info', async () => {
    const data = await ServiceServices.getService(1)
    expect(data.serviceName).toEqual(service.serviceName)
    expect(data.description).toEqual(service.description)
  })

  it('should throw error when service not found', async () => {
    await expect(ServiceServices.getService(-1)).rejects.toThrow(
      'Service not found',
    )
  })

  it('should can update service', async () => {
    const updatedService = {
      id: 1,
      serviceName: 'service updated',
      description: 'description',
    }

    const data = await ServiceServices.updateService(
      updatedService.id,
      updatedService,
    )

    expect(data.serviceName).toEqual(updatedService.serviceName)
    expect(data.description).toEqual(updatedService.description)
  })

  it('should can delete service', async () => {
    const data = await ServiceServices.deleteService(String(1))
    expect(data).toEqual({})
  })
})
