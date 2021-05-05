export interface SearchHistoryService {
  init(): Promise<boolean>;

  add(key: string): Promise<boolean>;

  delete(key: string): Promise<boolean>;

  history: Array<string>;
}
