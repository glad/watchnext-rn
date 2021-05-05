export interface CacheService {
  init(): Promise<boolean>;

  get(key: string): Promise<string | undefined>;

  put(key: string, value: string): Promise<boolean>;

  remove(key: string): Promise<boolean>;

  clear(): Promise<void>;
}
