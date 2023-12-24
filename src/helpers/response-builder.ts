import { Response } from 'express'

// Fungsi ResponseBuilder menerima objek options yang berisi informasi tentang respons yang akan dibangun,
// dan objek res yang merepresentasikan respons HTTP yang akan dikirimkan ke klien.
export default function ResponseBuilder(
  options: { code: number; data: unknown; message: string },
  res: Response,
) {
  // Membuat objek respons dengan properti code, data, dan message sesuai dengan nilai dari objek options.
  const response = {
    code: options.code,
    data: options.data,
    message: options.message,
  }

  // Jika options.data bernilai falsy (misalnya null), hapus properti data dari objek response.
  if (!options.data) delete response.data

  // Mengirimkan tanggapan HTTP dengan status code sesuai dengan options.code
  // dan merubah objek response menjadi format JSON.
  return res.status(options.code).json(response)
}
