// src/routes/kapsterRoutes.js
const { Router } = require ('express')
const { createKapsters, getAllKapster } = require ('../controllers/kapsterController')

const router = Router();

router.post('/kapster', createKapsters);
router.get('/kapster', getAllKapster);

module.exports = router;
