const { Kapster} = require('../models');
const kapster = require('../models/kapster');

//POST
const createKapster = async (req, res) => {
    try {
        const {name, gender, specialization} = req.body

        const newKapster = await Kapster.create({
            name: name,
            gender: gender,
            specialization: specialization
        })

        res.status(200).json(newKapster);
    }catch(error){
        console.log(error, '<-- Error Create Kapster')
       } 
    }

//GET DATA
const getAllKapster = async(req, res) => {
   try{
const kapster = await Kapster.findAll()
res.status(200).json({ kapster });
    
   }catch (error){
    res.status(404).json({ message: 'Kapster tidak ditemukan' });
   }
    }

module.exports = { getAllKapster, createKapster}