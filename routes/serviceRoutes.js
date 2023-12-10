const { getAllService } = require('../controllers/serviceController')

const router = require('express').Router()

router.get('/service', getAllService)

module.exports = router