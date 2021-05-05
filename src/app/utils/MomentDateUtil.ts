import {DateUtil} from '@watchnext-domain/utils';
var moment = require('moment');

export class MomentDateUtil implements DateUtil {
  public get nowTimestamp() {
    return moment().valueOf();
  }

  public asTimestamp(value: string): number {
    return value === undefined || value === null ? 0 : moment(value).valueOf();
  }

  public formatTimestamp(timestamp: number, format: string): string {
    return moment(timestamp).format(format);
  }

  diffYears(a: number, b: number): number {
    return moment(a).diff(moment(b), 'years');
  }
}
