import {BaseThrowable} from './BaseThrowable';

export class ContentFailedToLoadThrowable extends BaseThrowable {
  constructor(message?: string) {
    super('ContentFailedToLoadThrowable', message || 'Content failed to load');
  }
}
