import { ValidationError } from 'sequelize'
import { ValidationError as YupError } from 'yup'

export default function ErrorCatcher(error: Error): {
  code: number
  data: null
  message: string
} {
  if (error instanceof YupError) {
    return {
      code: 400,
      data: null,
      message: error.errors[0],
    }
  } else if (error instanceof ValidationError) {
    const errors = error.errors.map(err => err.message)
    return {
      code: 400,
      data: null,
      message: errors[0],
    }
  } else if (error.name === 'SequelizeUniqueConstraintError') {
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

  return {
    code: 500,
    data: null,
    message: error.message,
  }
}

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
