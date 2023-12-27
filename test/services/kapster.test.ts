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
  const kapster: KAPSTER = {
    id: 1,
    name: 'kapster',
    gender: KAPSTERGENDER.MAN,
    specialization: 'specialization',
    status: KAPSTERSTATUS.AVAILABLE,
  }

  it('should can create kapster', async () => {
    const data = await KapsterServices.createKapster(kapster)
    expect(data.name).toEqual(kapster.name)
    expect(data.gender).toEqual(kapster.gender)
    expect(data.specialization).toEqual(kapster.specialization)
  })

  it('should get kapster info', async () => {
    const data = await KapsterServices.getKapster(1)
    expect(data.name).toEqual(kapster.name)
    expect(data.gender).toEqual(kapster.gender)
    expect(data.specialization).toEqual(kapster.specialization)
  })

  it('should throw error when kapster not found', async () => {
    await expect(KapsterServices.getKapster(-1)).rejects.toThrow(
      'Kapster not found',
    )
  })

  it('should can update kapster', async () => {
    const updateKapster: KAPSTER = {
      id: 1,
      name: 'kapster',
      gender: KAPSTERGENDER.MAN,
      specialization: 'specialization',
      status: KAPSTERSTATUS.AVAILABLE,
    }
    const data = await KapsterServices.updateKapster(1, updateKapster)
    expect(data.name).toEqual(updateKapster.name)
    expect(data.gender).toEqual(updateKapster.gender)
    expect(data.specialization).toEqual(updateKapster.specialization)
  })

  // it('should can delete kapster', async () => {
  //   const data = await KapsterServices.deleteKapster(String(1))
  //   expect(data).toEqual({})
  // })

  const kapsterService: KAPSTERSERVICE = {
    id: 1,
    kapsterId: 1,
    serviceId: 1,
    isActive: true,
    price: 10000,
  }

  it('should can create kapster service', async () => {
    try {
      await ServiceServices.createService({
        id: 1,
        serviceName: 'service',
        description: 'description',
        isActive: true,
      })
      await KapsterServices.createKapster({ ...kapster, id: 2 })
    } catch (err) {
      null
    } finally {
      const data = await KapsterServices.createKapsterService(kapsterService)
      expect(data.kapsterId).toEqual(2)
      expect(data.serviceId).toEqual(2)
      expect(data.price).toEqual(10000)
    }
  })

  it('should get all kapster service info', async () => {
    const data = await KapsterServices.getKapsterServices(
      kapsterService.kapsterId,
    )

    expect(data).toBeInstanceOf(Array)
  })

  it('should can update service', async () => {
    const updatedService: KAPSTERSERVICE = {
      id: 1,
      kapsterId: 1,
      serviceId: 1,
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

  // it('should can delete service', async () => {
  //   const data = await KapsterServices.deleteKapsterService(String(1))
  //   expect(data).toEqual({})
  // })
})
