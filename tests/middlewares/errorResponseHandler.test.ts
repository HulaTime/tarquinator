import { Request } from 'express';

import errorResponseHandler from '../../src/middlewares/errorResponseHandler';
import LocalError from '../../src/lib/errors/LocalError';
import ErrorRegistry from '../../src/lib/errors/ErrorRegistry';
import ErrorClassFactory from '../../src/lib/errors/ErrorClassFactory';
import { ERR_CATEGORIES } from '../../src/constants';

describe('errorResponseHandler', () => {
  const expressRequest = {} as Request;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const expressResponse = { status: jest.fn().mockReturnThis(), json: jest.fn() } as any;
  const expressNext = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
    const errorReg = ErrorRegistry.getRegistry();
    errorReg.clear();
  });

  test('it should exist', () => {
    expect(errorResponseHandler).toBeDefined();
  });

  test('It should accept 4 parameters', () => {
    errorResponseHandler(new Error(), expressRequest, expressResponse, expressNext);
  });

  describe('When handling random errors', ()=> {
    describe( 'Generic Nodejs error received', () => {
      test('Should call the status fn on the express response parameter with 500', () => {
        errorResponseHandler(new Error(), expressRequest, expressResponse, expressNext);
        expect(expressResponse.status).toHaveBeenCalledTimes(1);
        expect(expressResponse.status).toHaveBeenCalledWith(500);
      });

      test('Should call the json fn on the express response parameter with an Internal Server Error msg', () => {
        errorResponseHandler(new Error(), expressRequest, expressResponse, expressNext);
        expect(expressResponse.json).toHaveBeenCalledTimes(1);
        expect(expressResponse.json).toHaveBeenCalledWith({ message: 'Internal Server Error' });
      });
    });

    describe( 'Nodejs TypeError received', () => {
      test('Should call the status fn on the express response parameter with 500', () => {
        errorResponseHandler(new TypeError(), expressRequest, expressResponse, expressNext);
        expect(expressResponse.status).toHaveBeenCalledTimes(1);
        expect(expressResponse.status).toHaveBeenCalledWith(500);
      });

      test('Should call the json fn on the express response parameter with an Internal Server Error msg', () => {
        errorResponseHandler(new TypeError(), expressRequest, expressResponse, expressNext);
        expect(expressResponse.json).toHaveBeenCalledTimes(1);
        expect(expressResponse.json).toHaveBeenCalledWith({ message: 'Internal Server Error' });
      });
    });

    describe( 'Random object received instead of an actual error', () => {
      test('Should call the status fn on the express response parameter with 500', () => {
        errorResponseHandler({}, expressRequest, expressResponse, expressNext);
        expect(expressResponse.status).toHaveBeenCalledTimes(1);
        expect(expressResponse.status).toHaveBeenCalledWith(500);
      });

      test('Should call the json fn on the express response parameter with an Internal Server Error msg', () => {
        errorResponseHandler({}, expressRequest, expressResponse, expressNext);
        expect(expressResponse.json).toHaveBeenCalledTimes(1);
        expect(expressResponse.json).toHaveBeenCalledWith({ message: 'Internal Server Error' });
      });
    });
  });

  describe('When handling an uncategorized "LocalError"', () => {
    test('Should call the status fn on the express response parameter with 500', () => {
      errorResponseHandler(new LocalError(''), expressRequest, expressResponse, expressNext);
      expect(expressResponse.status).toHaveBeenCalledTimes(1);
      expect(expressResponse.status).toHaveBeenCalledWith(500);
    });

    test('Should call the json fn on the express response parameter with an Internal Server Error msg', () => {
      errorResponseHandler(new LocalError(''), expressRequest, expressResponse, expressNext);
      expect(expressResponse.json).toHaveBeenCalledTimes(1);
      expect(expressResponse.json).toHaveBeenCalledWith({ message: 'Internal Server Error' });
    });
  });

  describe('When handling an error categorized as a "BadRequest" type error', () => {
    const BadRequestError = new ErrorClassFactory().createClass('bad request');

    beforeEach(() => {
      const errorReg = ErrorRegistry.getRegistry();
      errorReg.register(ERR_CATEGORIES.BAD_REQUEST, BadRequestError);
    });

    test('It should call the status fn on the express response parameter with 400', () => {
      errorResponseHandler(new BadRequestError('not nice'), expressRequest, expressResponse, expressNext);
      expect(expressResponse.status).toHaveBeenCalledTimes(1);
      expect(expressResponse.status).toHaveBeenCalledWith(400);
    });

    test('Should call the json fn on the express response parameter with a Bad Request msg', () => {
      errorResponseHandler(new BadRequestError('not nice'), expressRequest, expressResponse, expressNext);
      expect(expressResponse.json).toHaveBeenCalledTimes(1);
      expect(expressResponse.json).toHaveBeenCalledWith({ message: 'Bad Request' });
    });
  });

  describe('When handling an error categorized as an "Unauthorized" type error', () => {
    const UnauthorizedError = new ErrorClassFactory().createClass('Unauthorized');

    beforeEach(() => {
      const errorReg = ErrorRegistry.getRegistry();
      errorReg.register(ERR_CATEGORIES.UNAUTHORIZED, UnauthorizedError);
    });

    test('It should call the status fn on the express response parameter with 401', () => {
      errorResponseHandler(new UnauthorizedError('get out'), expressRequest, expressResponse, expressNext);
      expect(expressResponse.status).toHaveBeenCalledTimes(1);
      expect(expressResponse.status).toHaveBeenCalledWith(401);
    });

    test('Should call the json fn on the express response parameter with a Bad Request msg', () => {
      errorResponseHandler(new UnauthorizedError('get out'), expressRequest, expressResponse, expressNext);
      expect(expressResponse.json).toHaveBeenCalledTimes(1);
      expect(expressResponse.json).toHaveBeenCalledWith({ message: 'Unauthorized' });
    });
  });

  describe('When handling an error categorized as an "Forbidden" type error', () => {
    const ForbiddenError = new ErrorClassFactory().createClass('Forbidden');

    beforeEach(() => {
      const errorReg = ErrorRegistry.getRegistry();
      errorReg.register(ERR_CATEGORIES.FORBIDDEN, ForbiddenError);
    });

    test('It should call the status fn on the express response parameter with 403', () => {
      errorResponseHandler(new ForbiddenError('get out'), expressRequest, expressResponse, expressNext);
      expect(expressResponse.status).toHaveBeenCalledTimes(1);
      expect(expressResponse.status).toHaveBeenCalledWith(403);
    });

    test('Should call the json fn on the express response parameter with a Bad Request msg', () => {
      errorResponseHandler(new ForbiddenError('get out'), expressRequest, expressResponse, expressNext);
      expect(expressResponse.json).toHaveBeenCalledTimes(1);
      expect(expressResponse.json).toHaveBeenCalledWith({ message: 'Forbidden' });
    });
  });

  describe('When handling an error categorized as an "Conflict" type error', () => {
    const ConflictError = new ErrorClassFactory().createClass('Conflict');

    beforeEach(() => {
      const errorReg = ErrorRegistry.getRegistry();
      errorReg.register(ERR_CATEGORIES.CONFLICT, ConflictError);
    });

    test('It should call the status fn on the express response parameter with 409', () => {
      errorResponseHandler(new ConflictError('whoops'), expressRequest, expressResponse, expressNext);
      expect(expressResponse.status).toHaveBeenCalledTimes(1);
      expect(expressResponse.status).toHaveBeenCalledWith(409);
    });

    test('Should call the json fn on the express response parameter with a Bad Request msg', () => {
      errorResponseHandler(new ConflictError('whoops'), expressRequest, expressResponse, expressNext);
      expect(expressResponse.json).toHaveBeenCalledTimes(1);
      expect(expressResponse.json).toHaveBeenCalledWith({ message: 'Conflict' });
    });
  });
});
