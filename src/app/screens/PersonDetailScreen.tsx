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
  FetchTvShowDetailContentProps,
  PaginatedContentComponent,
  PaginatedContentLayoutType,
  TabsWithDetailOverviewPopupComponent,
} from '../components';
import {useDependencyContext} from '../contexts';
import {useOnAction} from '../hooks';

export const PersonDetailScreen = ({route, navigation}: any) => {
  const {personId} = route.params;

  const {contentProvider, entityToComponentMapper} = useDependencyContext();
  const {onAction} = useOnAction();

  const fetchOverviewDetailCallback = React.useCallback((_) => {
    return contentProvider.fetchPersonDetail(personId).then((content) => {
      navigation.setOptions({title: content.data?.name});
      return content;
    });
  }, []);

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

  const fetchPersonMovieCreditsCallback = React.useCallback(
    (_) => contentProvider.fetchPersonMovieCredits(personId),
    [],
  );
  const fetchPersonTvShowCreditsCallback = React.useCallback(
    (_) => contentProvider.fetchPersonTvShowCredits(personId),
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
          params={new FetchPersonDetailContentProps(personId)}
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
      key: 'movies',
      title: 'Movies',
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
          fetchContentCallback={fetchPersonMovieCreditsCallback}
        />
      ),
    },
    {
      key: 'tvshows',
      title: 'Tv Shows',
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
          fetchContentCallback={fetchPersonTvShowCreditsCallback}
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
          } else if (params instanceof FetchTvShowDetailContentProps) {
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
        onAction={onAction}
        selectedDetailOverviewPopupParams={selectedDetailOverviewPopupParams}
      />
    </View>
  );
};
