import {
  TMDbContentProvider,
  TMDbImageUrlProvider,
} from '@watchnext-data/providers';
import {
  AsyncStorageService,
  DefaultFavoriteContentService,
  DefaultSearchHistoryService,
  LRUCacheService,
} from '@watchnext-data/services';
import {
  ContentProvider,
  ImageUrlProvider,
  SettingsProvider,
} from '@watchnext-domain/providers';
import {
  CacheService,
  FavoriteContentService,
  SearchHistoryService,
} from '@watchnext-domain/services';
import {DateUtil, Logger} from '@watchnext-domain/utils';
import React from 'react';
import {AppSettingsProvider} from './../providers';
import {
  DefaultLogger,
  EntityToComponentMapper,
  MomentDateUtil,
} from './../utils';

export interface DependencyContextProps {
  logger: Logger;
  dateUtil: DateUtil;
  settingsProvider: SettingsProvider;
  cacheService: CacheService;
  favoriteContentService: FavoriteContentService;
  searchHistoryService: SearchHistoryService;
  imageUrlProvider: ImageUrlProvider;
  contentProvider: ContentProvider;
  entityToComponentMapper: EntityToComponentMapper;
  startupInit: () => Promise<boolean>;
}

export const DefaultDependencyContext: DependencyContextProps = (() => {
  const logger = new DefaultLogger();

  const dateUtil = new MomentDateUtil();
  const settingsStorage = new AsyncStorageService(logger, 'settings');
  const settingsProvider = new AppSettingsProvider(logger, settingsStorage);

  const cacheStorage = new AsyncStorageService(logger, 'cache');
  const cacheService = new LRUCacheService(
    logger,
    cacheStorage,
    settingsProvider,
  );

  const favoriteContentStorage = new AsyncStorageService(logger, 'favorites');
  const favoriteContentService = new DefaultFavoriteContentService(
    logger,
    favoriteContentStorage,
  );

  const searchHistoryStorage = new AsyncStorageService(logger, 'search');
  const searchHistoryService = new DefaultSearchHistoryService(
    logger,
    searchHistoryStorage,
  );

  const imageUrlProvider = new TMDbImageUrlProvider(logger);
  const contentProvider = new TMDbContentProvider(
    logger,
    cacheService,
    favoriteContentService,
    dateUtil,
  );

  const entityToComponentMapper = new EntityToComponentMapper(
    imageUrlProvider,
    dateUtil,
  );

  const initOrder = [
    () => settingsStorage.init(),
    () => settingsProvider.init(),
    () => cacheService.init(),
    () => favoriteContentStorage.init(),
    () => favoriteContentService.init(),
    () => searchHistoryStorage.init(),
    () => searchHistoryService.init(),
    () => contentProvider.init(),
    // () => cacheService.clear().then(_ => true),
  ];
  const startupInit = async (): Promise<boolean> => {
    return initOrder.reduce(
      (cur, next) => cur.then(next),
      Promise.resolve(true),
    );
  };

  return {
    logger: logger,
    dateUtil: dateUtil,
    settingsProvider: settingsProvider,
    cacheService: cacheService,
    favoriteContentService: favoriteContentService,
    searchHistoryService: searchHistoryService,
    imageUrlProvider: imageUrlProvider,
    contentProvider: contentProvider,
    entityToComponentMapper: entityToComponentMapper,
    startupInit: startupInit,
  };
})();

export const DependencyContext = React.createContext<DependencyContextProps>(
  DefaultDependencyContext,
);

export const DependencyContextProvider = (props: any) => {
  return (
    <DependencyContext.Provider value={DefaultDependencyContext}>
      {props.children}
    </DependencyContext.Provider>
  );
};

export const useDependencyContext = (): DependencyContextProps => {
  const context: DependencyContextProps | undefined = React.useContext(
    DependencyContext,
  )!!;

  if (context === undefined) {
    throw new Error('Failed to find DependencyContextProvider');
  }

  return context!!;
};
