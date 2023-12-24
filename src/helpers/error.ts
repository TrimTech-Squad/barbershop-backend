import { ValidationError } from 'sequelize'
import { ValidationError as YupError } from 'yup'

// Fungsi ErrorCatcher menerima objek error dan mengembalikan objek dengan format yang telah ditentukan.
export default function ErrorCatcher(error: Error): {
  code: number
  data: null
  message: string
} {
  // Jika error yang diterima merupakan instance dari YupError (dari Yup library),
  // maka hasilnya adalah objek dengan code 400, data null, dan message dari pesan error pertama.
  if (error instanceof YupError) {
    return {
      code: 400,
      data: null,
      message: error.errors[0],
    }
  } 
  // Jika error yang diterima merupakan instance dari ValidationError (dari Sequelize library),
  // maka hasilnya adalah objek dengan code 400, data null, dan message dari pesan error pertama.
  else if (error instanceof ValidationError) {
    const errors = error.errors.map(err => err.message)
    return {
      code: 400,
      data: null,
      message: errors[0],
    }
  } 
  // jika error adalah SequelizeUniqueConstraintError, maka hasilnya memiliki code 409. 
  else if (error.name === 'SequelizeUniqueConstraintError') {
    return {
      code: 409,
      data: null,
      message: error.message,
    }
  } else if (error.name === 'SequelizeForeignKeyConstraintError') {
    return {
      code: 400,
      data: null,
      message: error.message,
    }
  } else if (error.name === 'SequelizeDatabaseError') {
    return {
      code: 400,
      data: null,
      message: error.message,
    }
  } else if (error instanceof ForbiddenError) {
    return {
      code: 403,
      data: null,
      message: error.message,
    }
  } else if (error instanceof NotFoundError) {
    return {
      code: 404,
      data: null,
      message: error.message,
    }
  } else if (error instanceof BadRequestError) {
    return {
      code: 400,
      data: null,
      message: error.message,
    }
  } else if (error instanceof UnauthorizedError) {
    return {
      code: 401,
      data: null,
      message: error.message,
    }
  }

  // Jika tidak ada kategori yang cocok, maka hasilnya adalah objek dengan code 500, data null,
  // dan message dari pesan error yang diterima.
  return {
    code: 500,
    data: null,
    message: error.message,
  }
}

//melakukan penanganan error spesifik dalam fungsi ErrorCatcher.
export class ForbiddenError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ForbiddenError'
  }
}

export class NotFoundError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'NotFoundError'
  }
}

export class BadRequestError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'BadRequestError'
  }
}

export class UnauthorizedError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'UnauthorizedError'
  }
}
