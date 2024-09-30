class ApiError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(
    statusCode: number,
    message: string,
    isOperational: boolean = true,
    stack?: string
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

export default ApiError; // Use ES Module syntax for exporting
