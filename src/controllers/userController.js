const { UserService} = require('../services/user');
const ResponseBuilder = require('../helpers/response-builder');
const ErrorCatcher = require('../helpers/error');
const { object, string, mixed } = require('yup');

// Validasi Yup Schema
const userUpdateSchema = object({
  name: string().required('Nama harus diisi'),
  password: string().required('Password harus diisi'),
  email: string().required('Email harus diisi').email('Email tidak valid'),
  number: string().required('Nomor harus diisi'),
  photo_url: string(),
  role: mixed().oneOf(['Customer', 'Admin']).required('Role harus diisi'),
});

const getUserById = async (req, res) => {
    try {
      const { id } = req.params;
      const appointment = await UserService.getUser(id);
  
      if (!appointment) {
        return res.status(404).json({
          error: 'Jadwal tidak ditemukan',
        });
      }
  
      res.status(200).json(appointment);
    } catch (error) {
        return ResponseBuilder(ErrorCatcher(error), res);
    }
  };

const updateDataUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, password, email, number, photo_url, role } = req.body;

    // Validasi request menggunakan Yup
    await userUpdateSchema.validate(
      { name, password, email, number, photo_url, role },
      { abortEarly: false },
    );

    const user = await UserService.updateUser(id);

    if (!user) {
      return res.status(404).json({
        error: 'User tidak ditemukan',
      });
    }

    // Update data user
    user.name = name;
    user.password = password;
    user.email = email;
    user.number = number;
    user.photo_url = photo_url;
    user.role = role;
    user.updatedAt = new Date();

    // Save data
    await user.save();

    return ResponseBuilder(
      {
        code: 200,
        data: user,
        message: 'Data User berhasil diupdate',
      },
      res,
    );
  } catch (error) {
    console.log(error, '<-- Error Update Data User');
    return ResponseBuilder(ErrorCatcher(error), res);
  }
};

module.exports = {
  getUserById,
  updateDataUser,
};
