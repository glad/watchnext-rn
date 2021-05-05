import {Entity} from '@watchnext-domain/entities';
import {Result} from '@watchnext-domain/misc';
import {EmptyCollectionThrowable} from '@watchnext-domain/throwables';
import React from 'react';
import {View} from 'react-native';
import {Assets} from '../assets';
import {
  DetailOverviewComponent,
  FetchDetailContentProps,
  FetchPersonDetailContentProps,
  FetchTvShowDetailContentProps,
  FetchTvShowEpisodeDetailContentProps,
  PaginatedContentComponent,
  PaginatedContentLayoutType,
  TabsWithDetailOverviewPopupComponent,
} from '../components';
import {useDependencyContext} from '../contexts';
import {useOnAction} from '../hooks';

export const TvShowDetailScreen = ({route, navigation}: any) => {
  const {tvShowId} = route.params;
  let maxSeasons = 1;

  const {contentProvider, entityToComponentMapper} = useDependencyContext();
  const {onAction} = useOnAction();

  const fetchOverviewDetailCallback = React.useCallback((_) => {
    return contentProvider.fetchTvShowDetail(tvShowId).then((content) => {
      navigation.setOptions({title: content.data?.name});
      maxSeasons = content.data?.seasonCount || 0;
      if (maxSeasons > 0) {
        tabs.current.push({
          key: 'episodes',
          title: 'Episodes',
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
              fetchContentCallback={fetchTvShowEpisodesCallback}
            />
          ),
        });
      }

      return content;
    });
  }, []);

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
  const fetchTvShowEpisodeDetailCallback = React.useCallback(
    (params: FetchTvShowEpisodeDetailContentProps) =>
      contentProvider.fetchTvShowEpisodeDetail(
        params.tvShowId,
        params.season,
        params.episode,
      ),
    [],
  );

  const fetchTvShowCreditsCallback = React.useCallback(
    (_) => contentProvider.fetchTvShowCredits(tvShowId),
    [],
  );
  const fetchSimilarTvShowsCallback = React.useCallback(
    (page) => contentProvider.fetchSimilarTvShows(tvShowId, page),
    [],
  );
  const fetchRecommendedTvShowsCallback = React.useCallback(
    (page) => contentProvider.fetchRecommendedTvShows(tvShowId, page),
    [],
  );
  const fetchTvShowEpisodesCallback = React.useCallback(
    (season) =>
      contentProvider.fetchTvShowEpisodes(tvShowId, season, maxSeasons),
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
          params={new FetchTvShowDetailContentProps(tvShowId)}
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
          fetchContentCallback={fetchTvShowCreditsCallback}
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
          fetchContentCallback={fetchSimilarTvShowsCallback}
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
          fetchContentCallback={fetchRecommendedTvShowsCallback}
        />
      ),
    },
  ]);

  return (
    <View style={{flex: 1, backgroundColor: Assets.Colors.WINDOW_BACKGROUND}}>
      <TabsWithDetailOverviewPopupComponent
        tabs={tabs.current}
        fetchDetailCallback={(params: FetchDetailContentProps) => {
          if (params instanceof FetchTvShowDetailContentProps) {
            return fetchTvShowDetailCallback(params);
          } else if (params instanceof FetchPersonDetailContentProps) {
            return fetchPersonDetailCallback(params);
          } else if (params instanceof FetchTvShowEpisodeDetailContentProps) {
            return fetchTvShowEpisodeDetailCallback(params);
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
