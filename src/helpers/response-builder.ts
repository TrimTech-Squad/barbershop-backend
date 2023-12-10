import { Response } from 'express'
export default function ResponseBuilder(
  options: { code: number; data: unknown; message: string },
  res: Response,
) {
  const response = {
    code: options.code,
    data: options.data,
    message: options.message,
  }

  if (!options.data) delete response.data

  return res.status(options.code).json(response)
}
