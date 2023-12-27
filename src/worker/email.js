const nodemailer = require('nodemailer')
const dotenv = require('dotenv')
const { workerData, parentPort } = require('worker_threads')

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

console.log('Sending email to ->', workerData.to)

transporter.sendMail(
  {
    from: process.env.MAIL_USERNAME,
    to: workerData.to,
    subject: workerData.subject,
    html: workerData.html,
  },
  (err, info) => {
    if (err) {
      console.error(err)
      return parentPort.postMessage(err)
    }
    console.info(
      'Email with subject ' +
        workerData.subject +
        ' successfuly sent to ->' +
        info.envelope.to.join(', '),
    )
    parentPort.postMessage(info)
  },
)
