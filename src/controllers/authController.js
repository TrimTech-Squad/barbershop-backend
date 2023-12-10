import { object, string, mixed } from 'yup'
import UserServices from '../services/user'
import ResponseBuilder from '../helpers/response-builder'
import ErrorCatcher from '../helpers/error'

// @ts-ignore
export const register = async (req, res) => {
  const userSchema = object({
    name: string().required('Nama harus diisi'),
    email: string().required('Email harus diisi').email('Email tidak valid'),
    password: string().required('Password harus diisi'),
    photo_url: string().required('Photo harus diisi'),
    number: string().required('Nomor harus diisi'),
    role: mixed().oneOf(['Customer', 'Admin']).required('Role harus diisi'),
  })
  try {
    const body = req.body
    await userSchema.validate(body, { abortEarly: false })
    await UserServices.createUser(body)
    return ResponseBuilder(
      {
        code: 201,
        message: 'User successfully created.',
        data: null,
      },
      res,
    )
  } catch (error) {
    // @ts-ignore
    return ResponseBuilder(ErrorCatcher(error), res)
  }
}

// const login = async (req, res) => {
//   try {
//     const { email, password } = req.body

//     const user = await User.findOne({
//       where: { email },
//     })

//     if (!user) {
//       return res.status(401).json({
//         message: 'Authentication failed. Salah menginput email / password .',
//       })
//     }

//     const Password = bcrypt.compareSync(password, user.password)
//     if (!Password) {
//       return res
//         .status(401)
//         .json({ message: 'Authentication failed. Incorrect password.' })
//     }

//     //generateToken
//     const token = generateToken({
//       userId: user.id,
//       email: user.email,
//     })

//     return res
//       .status(200)
//       .json({ message: 'User successfully login.', token: token })
//   } catch (error) {
//     res.status(500).json({ message: 'Internal Server Error' })
//   }
// }
