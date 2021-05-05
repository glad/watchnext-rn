import {BaseThrowable} from './BaseThrowable';

export class EmptySearchResultsThrowable extends BaseThrowable {
  private constructor() {
    super('EmptySearchResultsThrowable', 'Empty search results');
  }

  static get INSTANCE() {
    return new EmptySearchResultsThrowable();
  }
}
