import {Entity} from '@watchnext-domain/entities';
import {Result} from '@watchnext-domain/misc';
import {EmptyCollectionThrowable} from '@watchnext-domain/throwables';
import React from 'react';
import {View} from 'react-native';
import {Assets} from '../assets';
import {
  DetailOverviewComponent,
  FetchDetailContentProps,
  FetchMovieDetailContentProps,
  FetchPersonDetailContentProps,
  PaginatedContentComponent,
  PaginatedContentLayoutType,
  TabsWithDetailOverviewPopupComponent,
} from '../components';
import {useDependencyContext} from '../contexts';
import {useOnAction} from '../hooks';

export const MovieDetailScreen = ({route, navigation}: any) => {
  const {movieId} = route.params;

  const {contentProvider, entityToComponentMapper} = useDependencyContext();
  const {onAction} = useOnAction();

  const fetchOverviewDetailCallback = React.useCallback((_) => {
    return contentProvider.fetchMovieDetail(movieId).then((content) => {
      navigation.setOptions({title: content.data?.title});
      return content;
    });
  }, []);

  const fetchMovieDetailCallback = React.useCallback(
    (params: FetchMovieDetailContentProps) =>
      contentProvider.fetchMovieDetail(params.movieId),
    [],
  );
  const fetchPersonDetailCallback = React.useCallback(
    (params: FetchPersonDetailContentProps) =>
      contentProvider.fetchPersonDetail(params.personId),
    [],
  );

  const fetchMovieCreditsCallback = React.useCallback(
    (_) => contentProvider.fetchMovieCredits(movieId),
    [],
  );
  const fetchSimilarMoviesCallback = React.useCallback(
    (page) => contentProvider.fetchSimilarMovies(movieId, page),
    [],
  );
  const fetchRecmmendedMoviesCallback = React.useCallback(
    (page) => contentProvider.fetchRecommendedMovies(movieId, page),
    [],
  );

  const [
    selectedDetailOverviewPopupParams,
    setSelectedDetailOverviewPopupParams,
  ] = React.useState<any | undefined>(undefined);
  const onThumbnailPress = (params: any) =>
    setSelectedDetailOverviewPopupParams(params);

  const tabs = React.useRef([
    {
      key: 'overview',
      title: 'Overview',
      component: (
        <DetailOverviewComponent
          params={new FetchMovieDetailContentProps(movieId)}
          entityToComponent={(entity: Entity) => {
            return entityToComponentMapper.toDetailOverview(entity, onAction, {
              showBackdrop: true,
              showOpenToDetailAction: false,
              showFavoriteAction: true,
              showShareAction: true,
            });
          }}
          fetchContentCallback={fetchOverviewDetailCallback}
        />
      ),
    },
    {
      key: 'cast',
      title: 'Cast',
      component: (
        <PaginatedContentComponent
          layoutType={PaginatedContentLayoutType.VERTICAL}
          entityToComponent={(entity: Entity, index: number) =>
            entityToComponentMapper.toSimpleContentCard(
              entity,
              index,
              onThumbnailPress,
            )
          }
          itemsPerRow={Assets.Numbers.THUMBNAILS_PER_ROW}
          fetchContentCallback={fetchMovieCreditsCallback}
        />
      ),
    },
    {
      key: 'similar',
      title: 'Similar',
      component: (
        <PaginatedContentComponent
          entityToComponent={(entity: Entity, index: number) =>
            entityToComponentMapper.toThumbnail(entity, index, onThumbnailPress)
          }
          itemsPerRow={Assets.Numbers.THUMBNAILS_PER_ROW}
          fetchContentCallback={fetchSimilarMoviesCallback}
        />
      ),
    },
    {
      key: 'recommended',
      title: 'Recommended',
      component: (
        <PaginatedContentComponent
          entityToComponent={(entity: Entity, index: number) =>
            entityToComponentMapper.toThumbnail(entity, index, onThumbnailPress)
          }
          itemsPerRow={Assets.Numbers.THUMBNAILS_PER_ROW}
          fetchContentCallback={fetchRecmmendedMoviesCallback}
        />
      ),
    },
  ]);

  return (
    <View style={{flex: 1, backgroundColor: Assets.Colors.WINDOW_BACKGROUND}}>
      <TabsWithDetailOverviewPopupComponent
        tabs={tabs.current}
        fetchDetailCallback={(params: FetchDetailContentProps) => {
          if (params instanceof FetchMovieDetailContentProps) {
            return fetchMovieDetailCallback(params);
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
    </View>
  );
};
