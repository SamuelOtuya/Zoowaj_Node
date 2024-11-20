class BaseError extends Error {
  constructor(name, statusCode, isOperational, message) {
    super(message || 'An error occurred'); // Default message
    Object.setPrototypeOf(this, new.target.prototype);
    this.name = name;
    this.statusCode = statusCode;
    this.isOperational = isOperational || true; // Default to true
    this.timestamp = new Date().toISOString(); // Add a timestamp for debugging
    Error.captureStackTrace(this);
  }
}

class ApiError extends BaseError {
  constructor(
    statusCode,
    message = 'An API Error Occurred',
    isOperational = true,
    name = 'ApiError',
  ) {
    super(name, statusCode, isOperational, message);
  }
}

class BadRequestError extends ApiError {
  constructor(message = 'Bad Request') {
    super(400, message, true, 'BadRequestError');
  }
}

class UnauthorizedError extends ApiError {
  constructor(message = 'Unauthorized') {
    super(401, message, true, 'UnauthorizedError');
  }
}

class ForbiddenError extends ApiError {
  constructor(message = 'Forbidden') {
    super(403, message, true, 'ForbiddenError');
  }
}

class NotFoundError extends ApiError {
  constructor(message = 'Not Found') {
    super(404, message, true, 'NotFoundError');
  }
}

class InternalServerError extends ApiError {
  constructor(message = 'Internal Server Error') {
    super(500, message, true, 'InternalServerError');
  }
}

export {
  BaseError,
  ApiError,
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  InternalServerError,
};
