import {Entity} from '@watchnext-domain/entities';
import {Result} from '@watchnext-domain/misc';
import {EmptyCollectionThrowable} from '@watchnext-domain/throwables';
import React from 'react';
import {View} from 'react-native';
import {Assets} from '../assets';
import {
  FetchDetailContentProps,
  FetchPersonDetailContentProps,
  PaginatedContentComponent,
  TabsWithDetailOverviewPopupComponent,
} from '../components';
import {useAppContext, useDependencyContext} from '../contexts';
import {useOnAction} from '../hooks';

export const PeopleListScreen = () => {
  const {contentProvider, entityToComponentMapper} = useDependencyContext();
  const {favoriteContentRefreshState} = useAppContext();
  const {onAction} = useOnAction();

  const fetchFavoritePeopleCallback = React.useCallback(
    (page) => contentProvider.fetchFavoritePeople(page),
    [],
  );
  const fetchPopularPeopleCallback = React.useCallback(
    (page) => contentProvider.fetchPopularPeople(page),
    [],
  );

  const fetchPersonDetailCallback = React.useCallback(
    (params: FetchPersonDetailContentProps) =>
      contentProvider.fetchPersonDetail(params.personId),
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
          fetchContentCallback={fetchFavoritePeopleCallback}
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
          fetchContentCallback={fetchPopularPeopleCallback}
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
          if (params instanceof FetchPersonDetailContentProps) {
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
