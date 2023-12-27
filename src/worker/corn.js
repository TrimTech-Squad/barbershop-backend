const dotenv = require('dotenv')
const { Appointment } = require('../../models/index')
const { Op } = require('sequelize')
const { parentPort } = require('worker_threads')
dotenv.config()

var cron = require('node-cron')

const updateTask = cron.schedule('*/30 * * * *', async () => {
  try {
    const date = new Date()
    const rows = await Appointment.update(
      { status: 'Completed' },
      {
        where: {
          status: {
            [Op.eq]: 'Booked',
          },
          time: {
            [Op.lt]: date,
          },
        },
      },
    )
    console.log(rows + ' rows updated')
  } catch (err) {
    console.log(err)
  }
})

updateTask.start()
parentPort.postMessage('Cron job started')
