import nodemailer from 'nodemailer'
import dotenv from 'dotenv'

dotenv.config()
const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: process.env.MAIL_HOST,
  port: Number(process.env.MAIL_PORT),
  secure: true,
  auth: {
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD,
  },
})

export const sendMail = async (to: string, subject: string, html: string) => {
  return new Promise((resolve, reject) => {
    transporter.sendMail(
      {
        from: process.env.MAIL_FROM,
        to,
        subject,
        html,
      },
      (err, info) => {
        if (err) reject(err)
        else {
          console.log('Email sent to : ' + info.envelope.to.join(', '))
          resolve(info)
        }
      },
    )
  })
}
