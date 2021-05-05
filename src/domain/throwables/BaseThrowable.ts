import {Throwable} from './Throwable';

export abstract class BaseThrowable implements Throwable {
  readonly name: string;
  readonly message: string;
  readonly stack: string = '';

  constructor(name: string, message: string) {
    this.name = name;
    this.message = message;
  }
}
