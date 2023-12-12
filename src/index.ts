import express from 'express'

const auth = require ('./routes/auth')
const kapster = require('./routes/kapsterRoutes')
const appointment = require('./routes/appointmentRoutes')
const service = require ('./routes/serviceRoutes')
const user = require ('./routes/userRoutes')

const app = express()

const port = process.env.PORT || 3000

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))

app.use('/api/auth', auth)
app.use(kapster)
app.use(appointment)
app.use(service)
app.use(user)

app.listen(port, () => {
  console.log('Server running on port 3000')
})
