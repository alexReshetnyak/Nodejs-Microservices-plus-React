import { DatabaseConnectionError } from './../errors/database-connection-error';
import { Response, Request, NextFunction } from 'express';

import { RequestValidationError } from './../errors/request-validation-error';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof RequestValidationError) {
    console.log('Handling error as validation error');
  }

  if (err instanceof DatabaseConnectionError) {
    console.log('Handling error as validation error');
  }

  res.status(400).send({ message: err.message });
};
