import {BaseThrowable} from './BaseThrowable';

export class EmptyCollectionThrowable extends BaseThrowable {
  private constructor() {
    super('EmptyCollectionThrowable', 'Empty collection');
  }

  static get INSTANCE() {
    return new EmptyCollectionThrowable();
  }
}
