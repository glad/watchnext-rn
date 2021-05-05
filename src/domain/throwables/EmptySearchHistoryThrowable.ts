import {BaseThrowable} from './BaseThrowable';

export class EmptySearchHistoryThrowable extends BaseThrowable {
  private constructor() {
    super('EmptySearchHistoryThrowable', 'Empty search results');
  }

  static get INSTANCE() {
    return new EmptySearchHistoryThrowable();
  }
}
