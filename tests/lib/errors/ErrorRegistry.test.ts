import ErrorRegistry from '../../../src/lib/errors/ErrorRegistry';
import LocalError from '../../../src/lib/errors/LocalError';
import ErrorClassFactory from '../../../src/lib/errors/ErrorClassFactory';

describe('ErrorRegistry', () => {
  const errorRegistry = ErrorRegistry.Create();

  afterEach(() => errorRegistry.clear());

  describe('#register', () => {
    test('A singleton instance of the ErrorRegistry can be created', () => {
      const errorRegistry2 = ErrorRegistry.Create();
      expect(errorRegistry).toBe(errorRegistry2);
    });

    test('A "LocalError" can be registered to a category', () => {
      const eReg = ErrorRegistry.Create();
      eReg.register('test', LocalError);
    });

    test('I can register different error types to different categories', () => {
      const eReg = ErrorRegistry.Create();
      const errorClassFactory = new ErrorClassFactory();
      const LocalErrorFoo = errorClassFactory.createClass('LocalErrorFoo');
      const LocalErrorBar = errorClassFactory.createClass('LocalErrorBar');
      eReg.register('foo', LocalErrorFoo);
      eReg.register('bar', LocalErrorBar);
    });
  });

  describe('#get', () => {
    const FOO_CATEGORY = 'foo';
    const BAR_CATEGORY = 'bar';

    test('If I get a category that has not been registered the return value is undefined', () => {
      expect(errorRegistry.get(FOO_CATEGORY)).toEqual(undefined);
    });

    test('I can get a category that I have previously registered', () => {
      errorRegistry.register(FOO_CATEGORY, LocalError);
      expect(errorRegistry.get(FOO_CATEGORY)).toEqual(new Set([LocalError]));
    });

    test('I can get error types from the categories I have registered independently', () => {
      const errorClassFactory = new ErrorClassFactory();
      const LocalErrorFoo = errorClassFactory.createClass('LocalErrorFoo');
      const LocalErrorBar = errorClassFactory.createClass('LocalErrorBar');
      errorRegistry.register(FOO_CATEGORY, LocalErrorFoo);
      errorRegistry.register(BAR_CATEGORY, LocalErrorBar);
      expect(errorRegistry.get(FOO_CATEGORY)).toEqual(new Set([LocalErrorFoo]));
      expect(errorRegistry.get(BAR_CATEGORY)).toEqual(new Set([LocalErrorBar]));
    });
  });

  describe('#isErrorInCategory', () => {
    test('If a supplied errors error type is defined in the specified category return true', () => {
      errorRegistry.register('test', LocalError);
      const error = new LocalError('some error');
      const result = errorRegistry.isErrorInCategory('test', error);
      expect(result).toBe(true);
    });

    test('If a supplied errors error type IS NOT in the specified category return false', () => {
      const errorClassFactory = new ErrorClassFactory();
      const LocalErrorFoo = errorClassFactory.createClass('LocalErrorFoo');
      const LocalErrorBar = errorClassFactory.createClass('LocalErrorBar');
      errorRegistry.register('test', LocalErrorFoo);
      const barError = new LocalErrorBar('issues');
      const result = errorRegistry.isErrorInCategory('test', barError);
      expect(result).toBe(false);
    });

    test('If I try to check an error against un unregistered category return false', () => {
      const barError = new LocalError('issues');
      const result = errorRegistry.isErrorInCategory('test', barError);
      expect(result).toBe(false);
    });
  });
});
