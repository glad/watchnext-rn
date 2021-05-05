export interface DateUtil {
  nowTimestamp: number;

  asTimestamp(value: string): number;

  formatTimestamp(timestamp: number, format: string): string;

  diffYears(a: number, b: number): number;
}
