import {Entity} from '@watchnext-domain/entities';
import {Result} from '@watchnext-domain/misc';
import {EmptyCollectionThrowable} from '@watchnext-domain/throwables';
import React from 'react';
import {View} from 'react-native';
import {Assets} from '../assets';
import {
  FetchDetailContentProps,
  FetchMovieDetailContentProps,
  PaginatedContentComponent,
  TabsWithDetailOverviewPopupComponent,
} from '../components';
import {useAppContext, useDependencyContext} from '../contexts';
import {useOnAction} from '../hooks';

export const MoviesListScreen = () => {
  const {contentProvider, entityToComponentMapper} = useDependencyContext();
  const {favoriteContentRefreshState} = useAppContext();
  const {onAction} = useOnAction();

  const fetchFavoriteMoviesCallback = React.useCallback(
    (page) => contentProvider.fetchFavoriteMovies(page),
    [],
  );
  const fetchPopularMoviesCallback = React.useCallback(
    (page) => contentProvider.fetchPopularMovies(page),
    [],
  );
  const fetchTopRatedMoviesCallback = React.useCallback(
    (page) => contentProvider.fetchTopRatedMovies(page),
    [],
  );
  const fetchUpcomingMoviesCallback = React.useCallback(
    (page) => contentProvider.fetchUpcomingMovies(page),
    [],
  );
  const fetchNowPlayingMoviesCallback = React.useCallback(
    (page) => contentProvider.fetchNowPlayingMovies(page),
    [],
  );

  const fetchMovieDetailCallback = React.useCallback(
    (params: FetchMovieDetailContentProps) =>
      contentProvider.fetchMovieDetail(params.movieId),
    [],
  );

  const [
    selectedDetailOverviewPopupParams,
    setSelectedDetailOverviewPopupParams,
  ] = React.useState<any | undefined>(undefined);
  const onThumbnailPress = (params: any) =>
    setSelectedDetailOverviewPopupParams(params);

  const tabs = [
    {
      key: 'favorite',
      title: 'Favorite',
      component: (
        <PaginatedContentComponent
          refreshState={favoriteContentRefreshState}
          entityToComponent={(entity: Entity, index: number) =>
            entityToComponentMapper.toThumbnail(entity, index, onThumbnailPress)
          }
          itemsPerRow={Assets.Numbers.THUMBNAILS_PER_ROW}
          fetchContentCallback={fetchFavoriteMoviesCallback}
        />
      ),
    },
    {
      key: 'popular',
      title: 'Popular',
      component: (
        <PaginatedContentComponent
          entityToComponent={(entity: Entity, index: number) =>
            entityToComponentMapper.toThumbnail(entity, index, onThumbnailPress)
          }
          itemsPerRow={Assets.Numbers.THUMBNAILS_PER_ROW}
          fetchContentCallback={fetchPopularMoviesCallback}
        />
      ),
    },
    {
      key: 'toprated',
      title: 'Top Rated',
      component: (
        <PaginatedContentComponent
          entityToComponent={(entity: Entity, index: number) =>
            entityToComponentMapper.toThumbnail(entity, index, onThumbnailPress)
          }
          itemsPerRow={Assets.Numbers.THUMBNAILS_PER_ROW}
          fetchContentCallback={fetchTopRatedMoviesCallback}
        />
      ),
    },
    {
      key: 'upcoming',
      title: 'Upcoming',
      component: (
        <PaginatedContentComponent
          entityToComponent={(entity: Entity, index: number) =>
            entityToComponentMapper.toThumbnail(entity, index, onThumbnailPress)
          }
          itemsPerRow={Assets.Numbers.THUMBNAILS_PER_ROW}
          fetchContentCallback={fetchUpcomingMoviesCallback}
        />
      ),
    },
    {
      key: 'nowplaying',
      title: 'Now Playing',
      component: (
        <PaginatedContentComponent
          entityToComponent={(entity: Entity, index: number) =>
            entityToComponentMapper.toThumbnail(entity, index, onThumbnailPress)
          }
          itemsPerRow={Assets.Numbers.THUMBNAILS_PER_ROW}
          fetchContentCallback={fetchNowPlayingMoviesCallback}
        />
      ),
    },
  ];
  return (
    <View style={{flex: 1, backgroundColor: Assets.Colors.WINDOW_BACKGROUND}}>
      <TabsWithDetailOverviewPopupComponent
        tabs={tabs}
        initialTabPosition={1}
        fetchDetailCallback={(params: FetchDetailContentProps) => {
          if (params instanceof FetchMovieDetailContentProps) {
            return fetchMovieDetailCallback(params);
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
        selectedDetailOverviewPopupParams={selectedDetailOverviewPopupParams}
        onAction={onAction}
      />
    </View>
  );
};
