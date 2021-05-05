import {Entity} from '@watchnext-domain/entities';
import {Result} from '@watchnext-domain/misc';
import {EmptyCollectionThrowable} from '@watchnext-domain/throwables';
import React from 'react';
import {View} from 'react-native';
import {Assets} from '../assets';
import {
  FetchDetailContentProps,
  FetchMovieDetailContentProps,
  FetchPersonDetailContentProps,
  FetchTvShowDetailContentProps,
  PaginatedContentComponent,
  SearchBarComponent,
  SearchHistoryComponent,
  TabsWithDetailOverviewPopupComponent,
} from '../components';
import {useDependencyContext} from '../contexts';
import {useOnAction} from '../hooks';

export const SearchScreen = () => {
  const {
    contentProvider,
    searchHistoryService,
    entityToComponentMapper,
  } = useDependencyContext();
  const {onAction} = useOnAction();

  const [searchQuery, setSearchQuery] = React.useState<string | undefined>();
  const [searchRefreshState, setSearchRefreshState] = React.useState<number>(0);

  const fetchMovieDetailCallback = React.useCallback(
    (params: FetchMovieDetailContentProps) =>
      contentProvider.fetchMovieDetail(params.movieId),
    [],
  );
  const fetchTvShowDetailCallback = React.useCallback(
    (params: FetchTvShowDetailContentProps) =>
      contentProvider.fetchTvShowDetail(params.tvShowId),
    [],
  );
  const fetchPersonDetailCallback = React.useCallback(
    (params: FetchPersonDetailContentProps) =>
      contentProvider.fetchPersonDetail(params.personId),
    [],
  );

  const searchMoviesCallback = React.useCallback(
    (page) => contentProvider.searchMovies(searchQuery || '', page),
    [searchQuery],
  );
  const searchTvShows = React.useCallback(
    (page) => contentProvider.searchTvShows(searchQuery || '', page),
    [searchQuery],
  );
  const searchPerson = React.useCallback(
    (page) => contentProvider.searchPerson(searchQuery || '', page),
    [searchQuery],
  );

  const [
    selectedDetailOverviewPopupParams,
    setSelectedDetailOverviewPopupParams,
  ] = React.useState<any | undefined>(undefined);
  const onThumbnailPress = (params: any) =>
    setSelectedDetailOverviewPopupParams(params);

  const performSearch = (query: string) => {
    (async () => {
      setSearchQuery(query);
      await searchHistoryService.add(query);
    })();
  };

  const deleteFromHistory = React.useCallback((query) => {
    (async () => {
      await searchHistoryService
        .delete(query)
        .then((_) => setSearchRefreshState((old) => old + 1));
    })();
  }, []);

  const tabs = [
    {
      key: 'movies',
      title: 'Movies',
      component: (
        <PaginatedContentComponent
          key={searchQuery}
          entityToComponent={(entity: Entity, index: number) =>
            entityToComponentMapper.toThumbnail(entity, index, onThumbnailPress)
          }
          itemsPerRow={Assets.Numbers.THUMBNAILS_PER_ROW}
          fetchContentCallback={searchMoviesCallback}
        />
      ),
    },
    {
      key: 'tvshows',
      title: 'Tv Shows',
      component: (
        <PaginatedContentComponent
          key={searchQuery}
          entityToComponent={(entity: Entity, index: number) =>
            entityToComponentMapper.toThumbnail(entity, index, onThumbnailPress)
          }
          itemsPerRow={Assets.Numbers.THUMBNAILS_PER_ROW}
          fetchContentCallback={searchTvShows}
        />
      ),
    },
    {
      key: 'people',
      title: 'People',
      component: (
        <PaginatedContentComponent
          key={searchQuery}
          entityToComponent={(entity: Entity, index: number) =>
            entityToComponentMapper.toThumbnail(entity, index, onThumbnailPress)
          }
          itemsPerRow={Assets.Numbers.THUMBNAILS_PER_ROW}
          fetchContentCallback={searchPerson}
        />
      ),
    },
  ];

  return (
    <View style={{flex: 1, backgroundColor: Assets.Colors.WINDOW_BACKGROUND}}>
      <SearchBarComponent
        updateInputQuery={searchQuery}
        performSearchCallback={performSearch}
      />
      {searchQuery ? (
        <TabsWithDetailOverviewPopupComponent
          tabs={tabs}
          fetchDetailCallback={(params: FetchDetailContentProps) => {
            if (params instanceof FetchMovieDetailContentProps) {
              return fetchMovieDetailCallback(params);
            } else if (params instanceof FetchTvShowDetailContentProps) {
              return fetchTvShowDetailCallback(params);
            } else if (params instanceof FetchPersonDetailContentProps) {
              return fetchPersonDetailCallback(params);
            } else {
              return new Promise((resolve, _) =>
                resolve(
                  new Result({
                    throwable: EmptyCollectionThrowable.INSTANCE,
                  }),
                ),
              );
            }
          }}
          onAction={onAction}
          selectedDetailOverviewPopupParams={selectedDetailOverviewPopupParams}
        />
      ) : (
        <SearchHistoryComponent
          refreshState={searchRefreshState}
          selectFromHistoryCallback={performSearch}
          deleteFromHistoryCallback={deleteFromHistory}
          fetchHistoryCallback={() =>
            Promise.resolve(searchHistoryService.history)
          }
        />
      )}
    </View>
  );
};
