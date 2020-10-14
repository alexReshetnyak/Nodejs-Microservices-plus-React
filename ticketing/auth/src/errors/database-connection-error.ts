export class DatabaseConnectionError extends Error {
  statusCode = 500;
  reason = 'Error connecting to DB';

  constructor() {
    super();

    // * Only because we are extending built in class
    Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
  }

  serializeErrors() {
    return [{ message: this.reason }];
  }
}
