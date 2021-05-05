import {
  SettingsCacheStrategy,
  SettingsProvider,
} from '@watchnext-domain/providers';
import {KeyValueStorageService} from '@watchnext-domain/services';
import {Logger} from '@watchnext-domain/utils';
import {
  SettingsCacheDuration,
  SettingsProviderData,
} from './../../domain/providers/SettingsProvider';

export class AppSettingsProvider implements SettingsProvider {
  private static STORAGE_KEY = 'app_settings';

  private initialized: boolean = false;
  private storageService: KeyValueStorageService;
  private data: SettingsProviderData = {
    cacheStrategy: SettingsCacheStrategy.NORMAL,
    cacheDuration: SettingsCacheDuration.ONE_DAY,
  };
  private logger: Logger;

  constructor(logger: Logger, storageService: KeyValueStorageService) {
    this.storageService = storageService;
    this.logger = logger;
  }

  async init(): Promise<boolean> {
    if (this.initialized) {
      return Promise.resolve(true);
    }
    this.initialized = true;
    this.logger.i(`AppSettingsProvider.init() called`);

    return await this.storageService
      .init()
      .then(() => this.storageService.get(AppSettingsProvider.STORAGE_KEY))
      .then((json) => {
        if (json !== undefined) {
          const obj = JSON.parse(json);

          this.data = {
            cacheStrategy: obj.cacheStrategy,
            cacheDuration: obj.cacheDuration,
          };

          return true;
        }

        return false;
      })
      .catch((error) => {
        this.logger.e(error);
        return false;
      });
  }

  public getSettings(): SettingsProviderData {
    return this.data;
  }

  public setSettings(data: SettingsProviderData): void {
    (async () => {
      this.data = data;
      await this.storageService
        .put(AppSettingsProvider.STORAGE_KEY, JSON.stringify(data))
        .then((_) => true)
        .catch((_) => true);
    })();
  }

  public get cacheStrategy() {
    return this.data.cacheStrategy;
  }

  public get cacheDuration(): SettingsCacheDuration {
    return this.data.cacheDuration;
  }

  public clearCache(): void {
    if (!this.initialized) {
      this.logger.e('AppSettingsProvider.clear: initialized = false');
      return;
    }

    (async () => await this.storageService.clear())();
  }
}
