import express from 'express'
import auth from './routes/auth'
import kapster from './routes/kapsterRoutes'
import appointment from './routes/appointmentRoutes'
import service from './routes/serviceRoutes'
import user from './routes/userRoutes'

const app = express()

const port = process.env.PORT || 3000

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))

app.use('/api/auth', auth)
app.use('/api/kapster', kapster)
app.use('/api/appointment', appointment)
app.use('/api/service', service)
app.use('/api/user', user)

app.listen(port, () => {
  console.log('Server running on port 3000')
})
