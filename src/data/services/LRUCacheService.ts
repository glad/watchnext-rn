import {
  SettingsCacheDuration,
  SettingsProvider,
} from '@watchnext-domain/providers';
import {CacheService, KeyValueStorageService} from '@watchnext-domain/services';
import {Logger} from '@watchnext-domain/utils';

export class LRUCacheService implements CacheService {
  static KEYS_KEY = 'LRUCache_keys';
  static MAP_DATA_KEY = 'LRUCache_map_data';

  private initialized: boolean = false;
  private readonly logger: Logger;
  private readonly storageService: KeyValueStorageService;
  private readonly settingsProvider: SettingsProvider;

  private readonly keys = new LRUKeyList();

  constructor(
    logger: Logger,
    storageService: KeyValueStorageService,
    settingsProvider: SettingsProvider,
  ) {
    this.logger = logger;
    this.storageService = storageService;
    this.settingsProvider = settingsProvider;
  }

  public async init(): Promise<boolean> {
    if (this.initialized) {
      return Promise.resolve(true);
    }
    this.initialized = true;

    if (this.settingsProvider.cacheDuration === SettingsCacheDuration.NEVER) {
      this.logger.w(`LRUCacheService.init() called -- CACHE DISABLED`);
    } else {
      this.logger.i(`LRUCacheService.init() called`);
    }

    return await this.storageService
      .init()
      .then((success) => {
        if (
          this.settingsProvider.cacheDuration === SettingsCacheDuration.NEVER
        ) {
          return Promise.resolve(undefined);
        } else if (success) {
          return this.storageService.get(LRUCacheService.KEYS_KEY);
        }
        return undefined;
      })
      .then((value) => {
        if (value !== undefined) {
          this.keys.fromJson(value);
          return true;
        }

        return false;
      });
  }

  public async clear(): Promise<void> {
    if (!this.initialized) {
      this.logger.e('LRUCacheService.clear: initialized = false');
      return Promise.reject();
    }
    this.keys.clear();
    return this.storageService.clear();
  }

  public async put(key: string, value: string): Promise<boolean> {
    if (!this.initialized) {
      this.logger.e('LRUCacheService.put: initialized = false');
      return Promise.reject();
    }

    if (this.settingsProvider.cacheDuration === SettingsCacheDuration.NEVER) {
      return Promise.resolve(false);
    }

    try {
      // Evict if there's too many entries
      if (this.keys.length + 1 > this.settingsProvider.cacheStrategy) {
        const droppedKey = this.keys.removeOldest();
        if (droppedKey !== undefined) {
          // this.logger.w(`Adding ${key} would exceeds capacity.  Evicting last entry ${droppedKey}`)
          await this.storageService.remove(droppedKey);
        }
      }

      // Update the key to the top of the list
      if (!this.keys.put(key)) {
        // this.logger.w(`put(${key}) -- already exists`)
      }

      // // Update value for key in storage
      await this.storageService.put(key, LRUData.asJSON(value));

      // // Update keys in storage
      await this.storageService.put(
        LRUCacheService.KEYS_KEY,
        this.keys.asJson(),
      );

      return Promise.resolve(true);
    } catch (error) {
      return Promise.resolve(false);
    }
  }

  public async get(key: string): Promise<string | undefined> {
    if (!this.initialized) {
      this.logger.e('LRUCacheService.get: initialized = false');
      return Promise.reject();
    }

    if (this.settingsProvider.cacheDuration === SettingsCacheDuration.NEVER) {
      return Promise.resolve(undefined);
    }

    const node = this.keys.get(key);

    if (node !== undefined) {
      return await this.storageService.get(key).then((json) => {
        if (json === undefined) {
          this.keys.remove(key);
          return undefined;
        }

        const data = LRUData.fromJSON(json);

        if (data !== undefined) {
          const age = new Date().getTime() - data.timestamp;
          if (
            this.settingsProvider.cacheDuration !==
            SettingsCacheDuration.FOREVER
          ) {
            if (age > this.settingsProvider.cacheDuration) {
              this.keys.remove(key);
            } else {
              return data.data;
            }
          }
        }

        return undefined;
      });
    }

    return Promise.resolve(undefined);
  }

  public async remove(key: string): Promise<boolean> {
    if (!this.initialized) {
      this.logger.e('LRUCacheService.remove: initialized = false');
      return Promise.reject();
    }

    this.keys.remove(key);
    return this.storageService.remove(key);
  }
}

interface LRUDataParams {
  data: string;
  timestamp: number;
}

class LRUData {
  public data: string;
  public timestamp: number;

  private constructor({data, timestamp}: LRUDataParams) {
    this.data = data;
    this.timestamp = timestamp;
  }

  static fromJSON(json: string): LRUData | undefined {
    try {
      const obj = JSON.parse(json);
      return new LRUData({
        data: obj.data,
        timestamp: obj.timestamp,
      });
    } catch (error) {
      return undefined;
    }
  }

  static asJSON(data: string): string {
    return JSON.stringify(
      new LRUData({
        data: data,
        timestamp: new Date().getTime(),
      }),
    );
  }
}

interface LRUNodeParams {
  prev?: LRUNode;
  key: string;
  next?: LRUNode;
}

class LRUNode {
  public prev?: LRUNode;
  public key: string;
  public next?: LRUNode;

  constructor({prev, key, next}: LRUNodeParams) {
    this.prev = prev;
    this.key = key;
    this.next = next;
  }
}

export class LRUKeyList {
  private head?: LRUNode;
  private tail?: LRUNode;

  public put = (key: string): boolean => {
    if (this.exists(key)) {
      // If it exists, put it to the top
      this.get(key);
      return false;
    }

    if (this.head === undefined) {
      this.head = new LRUNode({key: key});
      this.tail = this.head;
    } else {
      this.head.prev = new LRUNode({key: key, next: this.head});
      this.head = this.head.prev;
    }

    return true;
  };

  public get(key: string): LRUNode | undefined {
    let current: LRUNode | undefined = this.head;

    if (current !== undefined && current.key === key) {
      return current;
    }

    while (current !== undefined) {
      if (current.key === key) {
        const prev = current.prev;
        const next = current.next;

        if (current.next === undefined) {
          this.tail = prev;
        }

        if (prev !== undefined) {
          prev.next = next;
        }

        if (next !== undefined) {
          next.prev = prev;
        }

        if (this.head !== undefined) {
          current.next = this.head;
          this.head.prev = current;
          current.prev = undefined;
          this.head = current;
        }

        break;
      }

      current = current.next;
    }

    return current;
  }

  public remove(key: string): boolean {
    let current: LRUNode | undefined = this.head;

    while (current !== undefined) {
      if (current.key === key) {
        const prev = current.prev;
        const next = current.next;

        if (prev !== undefined) {
          prev.next = next;
        }

        if (next !== undefined) {
          next.prev = prev;
        }

        if (next === undefined) {
          this.tail = prev;
        }

        return true;
      }

      current = current.next;
    }

    return false;
  }

  public get length(): number {
    let currentNode: LRUNode | undefined = this.head;
    let length = 0;

    while (currentNode !== undefined) {
      length++;
      currentNode = currentNode.next;
    }

    return length;
  }

  public exists(key: string): boolean {
    let currentNode: LRUNode | undefined = this.head;

    while (currentNode !== undefined) {
      if (currentNode.key === key) {
        return true;
      }
      currentNode = currentNode.next;
    }

    return false;
  }

  public removeOldest(): string | undefined {
    let droppedKey = this.tail && this.tail.key;

    if (droppedKey !== undefined) {
      this.remove(droppedKey);
    }

    return droppedKey;
  }

  public clear() {
    this.head = undefined;
    this.tail = undefined;
  }

  public asJson(): string {
    let currentNode: LRUNode | undefined = this.head;
    let results = new Array();

    while (currentNode !== undefined) {
      results.push(currentNode.key);
      currentNode = currentNode.next;
    }

    try {
      return JSON.stringify(results);
    } catch (error) {
      return '[]';
    }
  }

  public fromJson(json: string) {
    this.head = undefined;
    this.tail = undefined;

    try {
      const array = JSON.parse(json).reverse();
      array.forEach((key: any) => {
        this.put(key.toString());
      });
    } catch (error) {}
  }
}
