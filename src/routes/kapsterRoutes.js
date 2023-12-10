const { createKapster, getAllKapster } = require('../controllers/kapsterController')

const router = require('express').Router()

router.post('/kapster', createKapster)
router.get('/kapster', getAllKapster)

module.exports = router