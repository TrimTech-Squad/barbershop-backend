import { Request, Response } from 'express'
import KapsterServices from '../services/kapster'
import { boolean, number, object } from 'yup'
import ResponseBuilder from '../helpers/response-builder'
import ErrorCatcher, { UnauthorizedError } from '../helpers/error'

// Mendefinisikan skema validasi menggunakan library Yup untuk objek kapsterService
const kapsterServiceSchema = object({
  kapsterId: number().required("Kapster's id is required"),
  serviceId: number().required("Service's id is required"),
  price: number().required('Price is required'),
  isActive: boolean(),
})

// Membuat KapsterService baru
export const createKapsterService = async (req: Request, res: Response) => {
  try {
    // Memeriksa apakah pengguna memiliki hak admin, jika tidak, lemparkan error UnauthorizedError
    if (!res.locals.isAdmin) throw new UnauthorizedError("You're not admin")

    // Mendapatkan data dari req body
    const body = req.body
    await kapsterServiceSchema.validate(body)
    // Membuat layanan kapster baru dari KapsterServices
    const kapsterService = await KapsterServices.createKapsterService(body)

    // Mengembalikan respons dengan menggunakan ResponseBuilder
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

// Fungsi untuk memperbarui informasi service kapster
export const updateKapsterService = async (req: Request, res: Response) => {
  try {
    // Memeriksa apakah pengguna memiliki hak admin, jika tidak, lemparkan error UnauthorizedError
    if (!res.locals.isAdmin) throw new UnauthorizedError("You're not admin")

    // Melakukan validasi parameter id yang ada dalam permintaan
    await number().required().validate(req.params.id)

    const body = req.body

    // Melakukan validasi input harga dan status menggunakan skema yang telah didefinisikan
    await number().required('Input price update').validate(body.price)
    await boolean().required('Input status update').validate(body.isActive)

    // Memperbarui informasi layanan kapster menggunakan layanan dari KapsterServices
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
