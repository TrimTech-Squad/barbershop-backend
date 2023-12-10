const { User, Appointment } = require('../models')

//GET BY ID
const getUserById = async(req, res) => {
    try{
        const { id } = req.params;
        const user = await User.findByPk(id, {
           include: [
            {
                model: Appointment,
                as: 'appointment2'
            }
           ]
        });
        
        if (user === null){
            return res.status(404).json({ 
                error :'User tidak ditemukan'
            });
        }

        res.status(200).json(user);
    } catch (error) {
        console.log(error, '<-- Error Get User by id')
    }
}


//PUT
const updateDataUser = async (req, res) => {
        try{
            //mendapatkan req params -> mendapatkan data movie berdasarkan id
            const { id } = req.params
            //mendapatkan req body
            const {name, password, email, number, photo_url, role} = req.body

            const user = await User.findByPk(id)

            if (!user) {
                return res.status(404).json({
                    error: 'Tidak ditemukan'
                });
            }
            //update
            user.name = name
            user.password = password
            user.email = email
            user.number = number
            user.photo_url = photo_url
            user.role = role
            user.updateAt = new Date()

            //save data
            user.save()
            //response
            res.status(200).json(user);
        } catch(error) {
            console.log(error, '<-- Error Update Data User')
        }
    }
    
    module.exports = {getUserById, updateDataUser}