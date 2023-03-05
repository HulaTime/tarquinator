export type LocalErrorType = new (msg: string) => LocalError

export default class LocalError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'LocalError';
  }
}
