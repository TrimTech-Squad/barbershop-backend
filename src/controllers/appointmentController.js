const { Appointment, User, Service} = require('../models');

//POST
const createAppointment = async (req, res) => {
    
    try {
        const {kapsterId, serviceId, date, time, status} = req.body;
        const user = req.authUser;
        const newAppointment = await Appointment.create({
            kapsterId,
            serviceId,
            date,
            time,
            status,
            userId: user.id
        });
        const load = await newAppointment.reload({
            include: [
                {
                    model: User,
                    as: 'user'
                }
            ]
        })

        res.status(200).json(load);
    }catch(error){
        console.log(error, '<-- Error Create Appointment')
       } 
    }

    //GET BY ID
const getAppointmentById = async(req, res) => {
    try{
        const { id } = req.params;
        const appointment = await Appointment.findByPk(id, {
           include: [
            {
                model: Service,
                as: 'service'
            }
           ]
        });
        
        if (appointment === null){
            return res.status(404).json({ 
                error :'Jadwal tidak ditemukan'
            });
        }

        res.status(200).json(appointment);
    } catch (error) {
        console.log(error, '<-- Error Get Appointment')
    }
}


//PUT
const updateDataAppointment = async (req, res) => {
    try {
        const { id } = req.params;
        const { kapsterId, serviceId, date, time, status } = req.body;

        const appointment = await Appointment.findByPk(id);
        if (!appointment) {
            return res.status(404).json({
                 message: "Jadwal tidak ditemukan" });
        }

        appointment.kapsterId = kapsterId || appointment.kapsterId;
        appointment.serviceId = serviceId || appointment.serviceId;
        appointment.date = date || appointment.date;
        appointment.time = time || appointment.time;
        appointment.status = status || appointment.status;

        await appointment.save();

        return res.status(200).json({
            kapsterId: appointment.kapsterId,
            serviceId: appointment.serviceId,
            date: appointment.date,
            time: appointment.time,
            status: appointment.status,
            userId: appointment.userId,
            updatedAt: appointment.updatedAt,
        });
    } catch(error) {
        console.log(error, '<-- Error Update Data Appointment')
    }
};

//DELETE
    const deleteAppointment = async (req, res) => {
        try{
            const { id } = req.params
            const appointment = await Appointment.findByPk(id)

            if (!appointment) {
                res.status(404).json({ message: 'jadwal tidak ditemukan' });
            }
            appointment.destroy()
            res.status(200).json({ message: `appointment dengan id ${id} berhasil dihapus` });

        }catch(error){
            console.log(error, '<-- Error Delete Appointment')
        }
    }

module.exports = {createAppointment, getAppointmentById, updateDataAppointment, deleteAppointment}