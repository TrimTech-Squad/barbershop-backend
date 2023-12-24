import { SentMessageInfo } from 'nodemailer/lib/smtp-transport'
import { Worker } from 'worker_threads'

// Fungsi untuk mengirim email dengan menggunakan worker thread.
export const sendMail = (
  to: string,
  subject: string,
  html: string,
): Promise<SentMessageInfo> => {

  // Membuat instance Worker yang akan menjalankan script di './src/worker/email.js'.
    // WorkerData berisi data yang akan diteruskan ke worker untuk diproses.
  return new Promise((resolve, reject) => {
    const worker = new Worker('./src/worker/email.js', {
      workerData: { to, subject, html },
    })

    // Menangani event 'message' dari worker. Ketika worker selesai melakukan tugas,
    // resolve Promise dengan pesan yang diterima dari worker (hasil pengiriman email).
    worker.on('message', resolve)

    // Menangani event 'error' dari worker. Jika terjadi error, reject Promise dengan error tersebut.
    worker.on('error', reject)

    // Menangani event 'exit' dari worker. Saat worker selesai, mencetak pesan ke konsol.
    worker.on('exit', exitCode => {
      console.log('Mail worker closed with exic code ' + exitCode)
    })
  })
}
