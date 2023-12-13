import express from 'express'
import authRoutes from './routes/auth'
import kapster from './routes/kapsterRoutes'
import appointment from './routes/appointmentRoutes'
import service from './routes/serviceRoutes'
import user from './routes/userRoutes'
import { auth } from './middlewares/auth'
import cookieParser from 'cookie-parser'

const app = express()

const port = process.env.PORT || 3000

app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))

app.use('/api/auth', authRoutes)
app.use('/api/kapster', kapster)
app.use('/api/appointment', appointment)
app.use('/api/services', auth, service)
app.use('/api/user', auth, user)

app.listen(port, () => {
  console.log('Server running on port 3000')
})
