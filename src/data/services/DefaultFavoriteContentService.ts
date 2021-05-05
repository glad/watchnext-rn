import {
  FavoriteContentService,
  KeyValueStorageService,
} from '@watchnext-domain/services';
import {Logger} from '@watchnext-domain/utils';
import {EntityKey} from './../../domain/entities/Entity';

export class DefaultFavoriteContentService implements FavoriteContentService {
  private static FAVORITES_KEY = 'favorites';

  private logger: Logger;
  private readonly storageService: KeyValueStorageService;
  private readonly favoriteKeys = new Set<string>();
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
    this.logger.i(`DefaultFavoriteContentService.init() called`);

    return await this.storageService
      .get(DefaultFavoriteContentService.FAVORITES_KEY)
      .then((json: any) => {
        if (json !== undefined) {
          const keys = JSON.parse(json) as Array<string>;
          keys.forEach((key) => this.favoriteKeys.add(key));
        }
      })
      .then((_) => true);
  }

  public isFavorited(key: string): boolean {
    return Array.from(this.favoriteKeys.values()).indexOf(key) !== -1;
  }

  public async toggle(key: string): Promise<boolean> {
    let added = false;
    if (this.isFavorited(key)) {
      this.favoriteKeys.delete(key);
    } else {
      this.favoriteKeys.add(key);
      added = true;
    }

    return await this.flush().then((_) => added);
  }

  public get favorites(): Array<EntityKey> {
    return Array.from(this.favoriteKeys.values())
      .reverse()
      .map((key) => EntityKey.fromJson(key))
      .filter((element): element is EntityKey => element !== null);
  }

  private async flush(): Promise<boolean> {
    const json = JSON.stringify(Array.from(this.favoriteKeys.values()));
    return this.storageService
      .put(DefaultFavoriteContentService.FAVORITES_KEY, json)
      .then((_) => true);
  }
}
