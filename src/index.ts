import express from 'express'

import ServiceRoutes from './routes/service'

const app = express()

const port = process.env.PORT || 3000

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))

app.use('/api/service', ServiceRoutes)

app.listen(port, () => {
  console.log('Server running on port 3000')
})
