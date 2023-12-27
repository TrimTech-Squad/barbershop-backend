import { SentMessageInfo } from 'nodemailer/lib/smtp-transport'
import { Worker } from 'worker_threads'

export const sendMail = (
  to: string,
  subject: string,
  html: string,
): Promise<SentMessageInfo> => {
  return new Promise((resolve, reject) => {
    const worker = new Worker('./src/worker/email.js', {
      workerData: { to, subject, html },
    })
    worker.on('message', resolve)
    worker.on('error', reject)
    worker.on('exit', exitCode => {
      console.log('Mail worker closed with exic code ' + exitCode)
    })
  })
}
