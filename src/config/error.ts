interface AppError {
  statusCode: number;
  message: string;
  isOperational: boolean;
}

class AppError extends Error {
  constructor(
    statusCode: number,
    message: string,
    isOperational: boolean = true,
    stack = ''
  ) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export default AppError;
