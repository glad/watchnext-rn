import AsyncStorage from '@react-native-async-storage/async-storage';
import {KeyValueStorageService} from '@watchnext-domain/services';
import {Logger} from '@watchnext-domain/utils';

export class AsyncStorageService implements KeyValueStorageService {
  private initialized: boolean = false;
  private readonly name: string;
  private logger: Logger;

  constructor(logger: Logger, name: string) {
    this.logger = logger;
    this.name = name;
  }

  private getKey = (key: string) => this.name + key;

  public async init(): Promise<boolean> {
    if (this.initialized) {
      return Promise.resolve(true);
    }
    this.initialized = true;
    this.logger.i(`AsyncStorageService.init(${this.name}) called`);

    return await AsyncStorage.getAllKeys()
      .catch((_) => [])
      .then((_) => true);
  }

  public async get(key: string): Promise<string | undefined> {
    if (!this.initialized) {
      this.logger.e('AsyncStorageService.get: initialized = false');
      return Promise.reject();
    }

    return AsyncStorage.getItem(this.getKey(key))
      .then((value) => (value === null ? undefined : value))
      .catch((_) => undefined);
  }

  public async put(key: string, value: string): Promise<boolean> {
    if (!this.initialized) {
      this.logger.e('AsyncStorageService.put: initialized = false');
      return Promise.reject();
    }

    return AsyncStorage.setItem(this.getKey(key), value)
      .then((_) => true)
      .catch((_) => false);
  }

  public async remove(key: string): Promise<boolean> {
    if (!this.initialized) {
      this.logger.e('AsyncStorageService.remove: initialized = false');
      return Promise.reject();
    }

    return AsyncStorage.removeItem(this.getKey(key))
      .then((_) => true)
      .catch((_) => false);
  }

  public async clear(): Promise<void> {
    if (!this.initialized) {
      this.logger.e('AsyncStorageService.clear: initialized = false');
      return Promise.reject();
    }

    this.logger.w(`AsyncStorageService(${this.name}).clear()`);
    return AsyncStorage.clear()
      .then((_) => {})
      .catch((_) => {});
  }
}
