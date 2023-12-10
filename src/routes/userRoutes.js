const { getUserById, updateDataUser } = require('../controllers/userController')

const router = require('express').Router()

router.get('/user/:id', getUserById)
router.put('/user', updateDataUser)

module.exports = router