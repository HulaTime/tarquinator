import { ErrorRequestHandler, Response } from 'express';

import ErrorRegistry from '../lib/errors/ErrorRegistry';
import LocalError from '../lib/errors/LocalError';
import { ERR_CATEGORIES } from '../constants';

const errorRegistry = ErrorRegistry.getRegistry();

const handleInternalServerError = (res: Response): void => {
  res.status(500).json({ message: 'Internal Server Error' });
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const errorResponseHandler: ErrorRequestHandler = (err, req, res, next) => {
  if (!(err instanceof LocalError)) {
    handleInternalServerError(res);
  } else if (errorRegistry.isErrorInCategory(ERR_CATEGORIES.BAD_REQUEST, err)) {
    res.status(400).json({ message: 'Bad Request' });
  } else if (errorRegistry.isErrorInCategory(ERR_CATEGORIES.UNAUTHORIZED, err)) {
    res.status(401).json({ message: 'Unauthorized' });
  } else if (errorRegistry.isErrorInCategory(ERR_CATEGORIES.FORBIDDEN, err)) {
    res.status(401).json({ message: 'Forbidden' });
  } else if (errorRegistry.isErrorInCategory(ERR_CATEGORIES.CONFLICT, err)) {
    res.status(409).json({ message: 'Conflict' });
  } else {
    handleInternalServerError(res);
  }
};

export default errorResponseHandler;
