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
import { getRefundRequest } from './controllers/order'
import compression from 'compression'
import dotenv from 'dotenv'
import cors from 'cors'

dotenv.config()

const app = express()

const port = process.env.PORT || 3000

/* `app.use(compression())` is enabling compression middleware in the Express application. Compression
middleware compresses the response bodies for all requests that pass through it, reducing the size
of the response and improving the performance of the application. */
app.use(compression())

app.use('/static', express.static('uploads'))

app.use(cors({ credentials: true, origin: process.env.ORIGINS?.split(',') }))
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))

app.use('/api/auth', authRoutes)
app.use('/api/kapsters', kapsters)
app.use('/api/order', orderRouter)
app.use('/api/kapster-service', auth, kapsterServiceRouter)
app.use('/api/appointment', auth, appointment)
app.use('/api/services', service)
app.use('/api/user', auth, user)

app.get('/order/confirm-refund/:id', getRefundRequest)

app.listen(port, () => {
  console.log('Server running on port 3000')
})

import { Worker } from 'worker_threads'
const worker = new Worker('./src/worker/corn.js')

worker.on('message', () => console.log('Corn worker started'))
worker.on('error', e => console.error('Corn worker error! ' + e))
worker.on('exit', exitCode => {
  console.log('Corn worker closed with exic code ' + exitCode)
})
