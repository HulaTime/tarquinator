import { Request } from 'express';

import errorResponseHandler from '../../src/middlewares/errorResponseHandler';
import LocalError from '../../src/lib/errors/LocalError';

describe('errorResponseHandler', () => {
  const expressRequest = {} as Request;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const expressResponse = { status: jest.fn().mockReturnThis(), json: jest.fn() } as any;
  const expressNext = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
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
});
