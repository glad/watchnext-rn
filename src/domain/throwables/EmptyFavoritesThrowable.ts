import {BaseThrowable} from './BaseThrowable';

export class EmptyFavoritesThrowable extends BaseThrowable {
  private constructor() {
    super('EmptyFavoritesThrowable', 'Empty favorites');
  }

  static get INSTANCE() {
    return new EmptyFavoritesThrowable();
  }
}
