import {Entity} from '@watchnext-domain/entities';
import {Result} from '@watchnext-domain/misc';
import {EmptyCollectionThrowable} from '@watchnext-domain/throwables';
import React from 'react';
import {View} from 'react-native';
import {Assets} from '../assets';
import {
  FetchDetailContentProps,
  FetchTvShowDetailContentProps,
  PaginatedContentComponent,
  TabsWithDetailOverviewPopupComponent,
} from '../components';
import {useAppContext, useDependencyContext} from '../contexts';
import {useOnAction} from '../hooks';

export const TvShowsListScreen = () => {
  const {contentProvider, entityToComponentMapper} = useDependencyContext();
  const {favoriteContentRefreshState} = useAppContext();
  const {onAction} = useOnAction();

  const fetchFavoriteTvShowsCallback = React.useCallback(
    (page) => contentProvider.fetchFavoriteTvShows(page),
    [],
  );
  const fetchPopularTvShowsCallback = React.useCallback(
    (page) => contentProvider.fetchPopularTvShows(page),
    [],
  );
  const fetchTopRatedTvShowsCallback = React.useCallback(
    (page) => contentProvider.fetchTopRatedTvShows(page),
    [],
  );
  const fetchOnTheAirTvShowsCallback = React.useCallback(
    (page) => contentProvider.fetchOnTheAirTvShows(page),
    [],
  );
  const fetchAiringTodayTvShowsCallback = React.useCallback(
    (page) => contentProvider.fetchAiringTodayTvShows(page),
    [],
  );

  const fetchTvShowDetailCallback = React.useCallback(
    (params: FetchTvShowDetailContentProps) =>
      contentProvider.fetchTvShowDetail(params.tvShowId),
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
          fetchContentCallback={fetchFavoriteTvShowsCallback}
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
          fetchContentCallback={fetchPopularTvShowsCallback}
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
          fetchContentCallback={fetchTopRatedTvShowsCallback}
        />
      ),
    },
    {
      key: 'ontheair',
      title: 'On The Air',
      component: (
        <PaginatedContentComponent
          entityToComponent={(entity: Entity, index: number) =>
            entityToComponentMapper.toThumbnail(entity, index, onThumbnailPress)
          }
          itemsPerRow={Assets.Numbers.THUMBNAILS_PER_ROW}
          fetchContentCallback={fetchOnTheAirTvShowsCallback}
        />
      ),
    },
    {
      key: 'airingtoday',
      title: 'Airing Today',
      component: (
        <PaginatedContentComponent
          entityToComponent={(entity: Entity, index: number) =>
            entityToComponentMapper.toThumbnail(entity, index, onThumbnailPress)
          }
          itemsPerRow={Assets.Numbers.THUMBNAILS_PER_ROW}
          fetchContentCallback={fetchAiringTodayTvShowsCallback}
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
          if (params instanceof FetchTvShowDetailContentProps) {
            return fetchTvShowDetailCallback(params);
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
