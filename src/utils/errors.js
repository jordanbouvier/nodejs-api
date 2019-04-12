export default class Errors {

  static HTTP_NOT_FOUND(message) {
    const error = new Error(message);
    error.statusCode = 404;
    return error;
  }
  static HTTP_UNAUTHORIZED(message) {
    const error = new Error(message);
    error.statusCode = 401;
    return error;
  }
  static HTTP_FORBIDDEN (message) {
    const error = new Error(message);
    error.statusCode = 403;
    return error;
  }
  static HTTP_UNPROCESSABLE_ENTITY(message, errors) {
    const error = new Error(message);
    error.statusCode = 422;
    error.errors = errors;
    return error;
  }
  static HTTP_BAD_REQUEST (message, errors) {
    const error = new Error(message);
    error.statusCode = 400;
    error.errors = errors;
    return error;
  }

}

export class HttpException extends Error 
{
  constructor(statusCode, ...params) {
    super(...params);

    if(Error.captureStackTrace) {
      Error.captureStackTrace(this, HttpException);
    }

    this.statusCode = statusCode;

    
  }
}


