import express from 'express'
import authRoutes from './routes/auth'
import kapsters from './routes/kapsterRoutes'
import appointment from './routes/appointmentRoutes'
import service from './routes/serviceRoutes'
import user from './routes/userRoutes'
import { auth } from './middlewares/auth'
import cookieParser from 'cookie-parser'
import kapsterServiceRouter from './routes/kapsterServiceRoutes'
import orderRouter from './routes/order'
import { getCancelationRequest } from './controllers/order'

const app = express()

const port = process.env.PORT || 3000

app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))

app.use('/api/auth', authRoutes)
app.use('/api/kapsters', auth, kapsters)
app.use('/api/order', orderRouter)
app.use('/api/kapster-service', auth, kapsterServiceRouter)
app.use('/api/appointment', auth, appointment)
app.use('/api/services', auth, service)
app.use('/api/user', auth, user)

app.get('/order/confirmation-cancel/:id', getCancelationRequest)

app.listen(port, () => {
  console.log('Server running on port 3000')
})
