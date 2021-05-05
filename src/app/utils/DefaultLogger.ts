import {Logger} from '@watchnext-domain/utils';

export class DefaultLogger implements Logger {
  private loggedLines = Array<string>();

  private get timestamp() {
    const now = new Date();
    const h = now.getHours();
    const m = now.getMinutes();
    const s = now.getSeconds();
    const ms = now.getMilliseconds();
    return `${h}:${m}:${s}.${ms}`;
  }

  i = (text: string) => {
    const line = `${this.timestamp} /I ${text}`;
    __DEV__ && console.info(line);
    this.addLine(line);
  };

  d = (text: string) => {
    const line = `${this.timestamp} /D ${text}`;
    __DEV__ && console.debug(line);
    this.addLine(line);
  };

  w = (text: string, error?: any) => {
    const line = `${this.timestamp} /W ${text}`;
    __DEV__ && console.warn(line, error ? error : '');
    this.addLine(line);
  };

  e = (text: string, error?: any) => {
    const line = `${this.timestamp} /E ${text}`;
    __DEV__ && console.error(line, error ? error : '');
    this.addLine(line);
  };

  public get lines(): Array<string> {
    return this.loggedLines;
  }

  private addLine(line: string) {
    if (!__DEV__) {
      // Non-debug only
      if (this.loggedLines.length + 1 === 1000) {
        this.loggedLines.shift();
      }
      this.loggedLines.push(line);
    }
  }
}
