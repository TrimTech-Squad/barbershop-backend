const { User } = require('../models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { generateToken } = require('../helpers/jwt.js')

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const emailUsed = await User.findOne({
      where: { email }
    });

    if (emailUsed) {
      return res.status(400).json({ name: 'bad request', message: "email sudah digunakan" });
    }

    // Hash the password asynchronously
    const hashPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashPassword,
      isAdmin: true
    });

    // Don't send the hashed password in the response
    delete user.password;

    res.status(201).json({ message: 'akun berhasil dibuat, silahkan login.' });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ message: 'Terjadi kesalahan saat membuat akun.' });
  }
};


const login = async (req, res) => {
  try{
  const { email, password } = req.body;

  const user = await User.findOne({ 
    where: { email }
   })

   if (!user){
    return res.status(401).json({ message: 'Authentication failed. Salah menginput email / password .' });
   }
       
    const Password = bcrypt.compareSync(password, user.password);
        if(!Password) {
          return res.status(401).json({ message: 'Authentication failed. Incorrect password.' });
        } 
        
        //generateToken
         token = generateToken({ 
            userId: user.id, 
            email: user.email });

        return res.status(200).json({ message: 'User successfully login.', token: token})

  } catch(error){
      res.status(500).json({ message: 'Internal Server Error' });
    };
};

module.exports = { register, login }