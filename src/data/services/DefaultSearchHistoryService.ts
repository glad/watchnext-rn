import {
  KeyValueStorageService,
  SearchHistoryService,
} from '@watchnext-domain/services';
import {Logger} from '@watchnext-domain/utils';

export class DefaultSearchHistoryService implements SearchHistoryService {
  private static QUERIES_KEY = 'queries';

  private logger: Logger;
  private readonly storageService: KeyValueStorageService;
  private readonly queries = new Set<string>();
  private initialized: boolean = false;

  constructor(logger: Logger, storageService: KeyValueStorageService) {
    this.storageService = storageService;
    this.logger = logger;
  }

  public async init(): Promise<boolean> {
    if (this.initialized) {
      return Promise.resolve(true);
    }
    this.initialized = true;
    this.logger.i(`DefaultSearchHistoryService.init() called`);

    return await this.storageService
      .get(DefaultSearchHistoryService.QUERIES_KEY)
      .then((json: any) => {
        if (json !== undefined) {
          const queries = JSON.parse(json) as Array<string>;
          queries.forEach((query) => this.queries.add(query));
        }
      })
      .then((_) => true);
  }

  public async delete(key: string): Promise<boolean> {
    this.queries.delete(key);

    return await this.flush().then((_) => true);
  }

  public async add(key: string): Promise<boolean> {
    if (key.trim().length > 0) {
      this.queries.delete(key);
      this.queries.add(key);

      return await this.flush().then((_) => true);
    }

    return Promise.resolve(false);
  }

  public get history(): Array<string> {
    return Array.from(this.queries.values()).reverse();
  }

  private async flush(): Promise<boolean> {
    const json = JSON.stringify(Array.from(this.queries.values()));
    return this.storageService
      .put(DefaultSearchHistoryService.QUERIES_KEY, json)
      .then((_) => true);
  }
}
