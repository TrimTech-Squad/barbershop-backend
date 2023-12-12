import { Router } from 'express'
import { getAllService } from '../controllers/serviceController'

const router = Router();

router.get('/service', getAllService)

module.exports = router