export interface Logger {
  i(text: string): void;
  d(text: string): void;
  w(text: string, error?: any): void;
  e(text: string, error?: any): void;

  lines: Array<string>;
}
