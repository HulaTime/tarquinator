import LocalError, { LocalErrorType } from './LocalError';

export default class ErrorRegistry {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
  }

  private static instance: ErrorRegistry;

  static getRegistry(): ErrorRegistry {
    if (ErrorRegistry.instance) {
      return ErrorRegistry.instance;
    }
    ErrorRegistry.instance = new ErrorRegistry();
    return ErrorRegistry.instance;
  }

  private categories: Map<string, Set<LocalErrorType>> = new Map();

  register(categoryName: string, error: LocalErrorType): void {
    const category = this.categories.get(categoryName);
    if (category) {
      category.add(error);
    } else {
      const newCategory = new Set([error]);
      this.categories.set(categoryName, newCategory);
    }
  }

  get(categoryName: string): Set<LocalErrorType> | undefined {
    return this.categories.get(categoryName);
  }

  isErrorInCategory<ET extends LocalError>(
    categoryName: string,
    errorInstance: ET,
  ): errorInstance is ET {
    const category = this.categories.get(categoryName);
    if (!category) {
      return false;
    }
    const categorizedErrors = Array.from(category);
    return !!categorizedErrors.find(
      (categorizedErrorClass) => categorizedErrorClass.name === errorInstance.name,
    );
  }

  clear(): void {
    this.categories = new Map();
  }
}
