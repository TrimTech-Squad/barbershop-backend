const { Service } = require('../models')

//GET DATA
const getAllService = async(req, res) => {
    try{
 const service = await Service.findAll()
 res.status(200).json({ service });
     
    }catch (error){
     res.status(404).json({ message: 'Layanan tidak ditemukan' });
    }
     }

module.exports = {getAllService}