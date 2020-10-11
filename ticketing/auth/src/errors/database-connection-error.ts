
export class DatabaseConnectionError extends Error {
  reason = 'Error connecting to DB';
  
  constructor() {
    super();

    // * Only because we are extending built in class
    Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
  }
}
