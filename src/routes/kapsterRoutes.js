// src/routes/kapsterRoutes.js
const { Router } = require('express')
const {
  createKapster,
  getAllKapster,
} = require('../controllers/kapsterController')

const router = Router()

console.log(createKapster)

router.post('/kapster', createKapster)
router.get('/kapster', getAllKapster)

module.exports = router
