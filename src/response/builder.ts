import { Response } from 'express'
export default function ResponseBuilder(
  options: { code: number; data: unknown; message: string },
  res: Response,
) {
  return res.status(options.code).json({
    data: options.data,
    status: options.code,
    message: options.message,
    timestamp: new Date().toISOString(),
  })
}
