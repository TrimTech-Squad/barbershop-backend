import { Request, Response } from 'express'
import KapsterServices from '../services/kapster'
import { boolean, number, object } from 'yup'
import ResponseBuilder from '../helpers/response-builder'
import ErrorCatcher, { UnauthorizedError } from '../helpers/error'

const kapsterServiceSchema = object({
  kapsterId: number().required("Kapster's id is required"),
  serviceId: number().required("Service's id is required"),
  price: number().required('Price is required'),
  isActive: boolean(),
})

export const createKapsterService = async (req: Request, res: Response) => {
  try {
    if (!res.locals.isAdmin) throw new UnauthorizedError("You're not admin")
    const body = req.body
    await kapsterServiceSchema.validate(body)
    const kapsterService = await KapsterServices.createKapsterService(body)
    return ResponseBuilder(
      {
        code: 201,
        message: 'Kapster service created',
        data: kapsterService,
      },
      res,
    )
  } catch (error) {
    return ResponseBuilder(ErrorCatcher(error as Error), res)
  }
}

export const getKapsterServices = async (_req: Request, res: Response) => {
  try {
    const kapsterServices = await KapsterServices.getKapsterServices()

    return ResponseBuilder(
      {
        code: 200,
        message: 'Kapster services retrieved',
        data: kapsterServices,
      },
      res,
    )
  } catch (error) {
    return ResponseBuilder(ErrorCatcher(error as Error), res)
  }
}

export const updateKapsterService = async (req: Request, res: Response) => {
  try {
    if (!res.locals.isAdmin) throw new UnauthorizedError("You're not admin")

    await number().required().validate(req.params.id)

    const body = req.body

    await number().required('Input price update').validate(body.price)
    await boolean().required('Input status update').validate(body.isActive)

    const kapsterService = await KapsterServices.updateKapsterService(
      parseInt(req.params.id),
      body,
    )

    return ResponseBuilder(
      {
        code: 200,
        message: 'Kapster service updated',
        data: kapsterService,
      },
      res,
    )
  } catch (error) {
    return ResponseBuilder(ErrorCatcher(error as Error), res)
  }
}
