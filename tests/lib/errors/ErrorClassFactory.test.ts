import ErrorClassFactory from '../../../src/lib/errors/ErrorClassFactory';
import LocalError from '../../../src/lib/errors/LocalError';

describe('ErrorClasFactory', () => {
  test('It should exist', () => {
    expect(ErrorClassFactory).toBeDefined();
  });

  test('It can be instantiated', () => {
    const errorClassFactory = new ErrorClassFactory();
    expect(errorClassFactory).toBeDefined();
  });

  test('It can be used to create a new "LocalError" class', () => {
    const errorClassFactory = new ErrorClassFactory();
    const NewError = errorClassFactory.createClass('FooBar');
    expect(NewError).toBeDefined();
    expect(Object.getPrototypeOf(NewError.prototype)).toBe(LocalError.prototype);
  });

  test('A newly created class correctly reports instanceof LocalError to be true once instantiated', () => {
    const errorClassFactory = new ErrorClassFactory();
    const NewError = errorClassFactory.createClass('FooBar');
    const error = new NewError('test');
    expect(error).toBeInstanceOf(LocalError);
  });

  test('The newly created class should be named correctly', () => {
    const errorClassFactory = new ErrorClassFactory();
    const errorName = 'FooBar';
    const NewError = errorClassFactory.createClass(errorName);
    expect(NewError.name).toEqual(errorName);
  });

  test('The newly created class should be named correctly once instantiated', () => {
    const errorClassFactory = new ErrorClassFactory();
    const errorName = 'FooBar';
    const NewError = errorClassFactory.createClass(errorName);
    const error = new NewError('test');
    expect(error.name).toEqual(errorName);
  });
});
