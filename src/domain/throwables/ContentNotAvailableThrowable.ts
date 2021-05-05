import {BaseThrowable} from './BaseThrowable';

export class ContentNotAvailableThrowable extends BaseThrowable {
  private constructor() {
    super('ContentNotAvailableThrowable', 'Content not available');
  }

  static get INSTANCE() {
    return new ContentNotAvailableThrowable();
  }
}
