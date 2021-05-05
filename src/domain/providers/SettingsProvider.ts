export enum SettingsCacheStrategy {
  LOW = 100,
  NORMAL = 1000,
  HIGH = 10000,
}

export enum SettingsCacheDuration {
  NEVER = -1,
  ONE_DAY = 60 * 60 * 24 * 1000,
  ONE_WEEK = 8 * (60 * 60 * 24 * 1000),
  FOREVER = 0,
}

export interface SettingsProviderData {
  cacheStrategy: SettingsCacheStrategy;
  cacheDuration: SettingsCacheDuration;
}

export interface SettingsProvider {
  init(): Promise<boolean>;

  getSettings(): SettingsProviderData;
  setSettings(data: SettingsProviderData): void;

  cacheStrategy: SettingsCacheStrategy;
  cacheDuration: SettingsCacheDuration;

  clearCache(): void;
}

export const DefaultSettingsProviderData: SettingsProviderData = {
  cacheStrategy: SettingsCacheStrategy.NORMAL,
  cacheDuration: 1,
};
