export class ValueHelper {
  public static missingToDefault<T, D>(input: T, defaultValue: D): D {
    try {
      return this.requireValue(<any>input);
    } catch (error) {
      return defaultValue;
    }
  }

  public static requireValue<T>(input: T, message?: string): T {
    if (
      typeof input === 'string' &&
      input !== undefined &&
      input.trim().length > 0
    ) {
      return input;
    } else if (Array.isArray(input) && input.length > 0) {
      return input;
    } else if (input !== undefined) {
      return input;
    } else {
      throw Error(message || 'Value cannot be null or empty');
    }
  }
}
