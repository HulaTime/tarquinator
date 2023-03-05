import LocalError, { LocalErrorType } from './LocalError';

export default class ErrorClassFactory {
  createClass(className: string): LocalErrorType {
    class CustomError extends LocalError {
      constructor(msg: string) {
        super(msg);
        this.name = className;
      }
    }
    Object.defineProperty(CustomError,'name', { value: className });
    return CustomError;
  }
}
