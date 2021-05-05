import { Entity } from '@watchnext-domain/entities'
import { Result } from '@watchnext-domain/misc'
import { EmptyCollectionThrowable } from '@watchnext-domain/throwables'
import React from 'react'
import { View } from 'react-native'
import { Assets } from '../assets'
import {
  DetailOverviewComponent,
  FetchDetailContentProps,
  FetchTvShowEpisodeDetailContentProps,
  TabsWithDetailOverviewPopupComponent
} from '../components'
import { useDependencyContext } from '../contexts'
import { useOnAction } from '../hooks'

export const TvShowEpisodeDetailScreen = ({route, navigation}: any) => {
  const {tvShowId, season, episode} = route.params;

  const {contentProvider, entityToComponentMapper} = useDependencyContext();
  const {onAction} = useOnAction();

  const fetchOverviewDetailCallback = React.useCallback((_) => {
    return contentProvider
      .fetchTvShowEpisodeDetail(tvShowId, season, episode)
      .then(content => {
        navigation.setOptions({title: content.data?.name});
        return content;
      });
  }, []);

  const tabs = React.useRef([
    {
      key: 'overview',
      title: 'Overview',
      component: (
        <DetailOverviewComponent
          params={
            new FetchTvShowEpisodeDetailContentProps(tvShowId, season, episode)
          }
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
  ]);

  return (
    <View style={{flex: 1, backgroundColor: Assets.Colors.WINDOW_BACKGROUND}}>
      <TabsWithDetailOverviewPopupComponent
        tabs={tabs.current}
        fetchDetailCallback={(params: FetchDetailContentProps) => {
          return new Promise((resolve, _) =>
            resolve(
              new Result({
                throwable: EmptyCollectionThrowable.INSTANCE,
              }),
            ),
          );
        }}
        onAction={onAction}
      />
    </View>
  );
};
