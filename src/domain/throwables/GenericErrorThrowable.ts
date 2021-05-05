import {BaseThrowable} from './BaseThrowable';

export class GenericErrorThrowable extends BaseThrowable {
  constructor(message?: string) {
    super('GenericErrorThrowable', message || 'Unknown error');
  }
}
