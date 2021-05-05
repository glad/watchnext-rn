import {ContentLoadingEntity, Entity} from '@watchnext-domain/entities';
import {Result} from '@watchnext-domain/misc';
import React from 'react';
import {FlatList, FlatListProps, View} from 'react-native';
import {Assets} from '../assets';
import {EmptyContentComponent} from './EmptyContentComponent';

export enum PaginatedContentLayoutType {
  HORIZONTAL,
  VERTICAL,
  GRID,
}

export interface PaginatedContentComponentProps {
  fetchContentCallback: (page: number) => Promise<Result<Entity[]>>;
  entityToComponent: (entity: Entity, index: number) => React.ReactElement;
  itemsPerRow?: number;
  layoutType?: PaginatedContentLayoutType;
  refreshState?: number;
}

export const PaginatedContentComponent = React.memo(
  ({
    fetchContentCallback,
    entityToComponent,
    itemsPerRow,
    layoutType,
    refreshState,
  }: PaginatedContentComponentProps) => {
    const [content, setContent] = React.useState<Entity[] | undefined>([
      ContentLoadingEntity.newInstance(),
    ]);
    const [errorMessage, setErrorMessage] = React.useState<string | undefined>(
      undefined,
    );
    const isFetching = React.useRef(false);
    const currentPage = React.useRef(1);

    const refreshContent = React.useCallback(() => {
      setContent([ContentLoadingEntity.newInstance()]);
      currentPage.current = 1;
    }, [refreshState]);

    const fetchContent = React.useCallback((page: number) => {
      if (isFetching.current) {
        return undefined;
      }
      isFetching.current = true;

      fetchContentCallback(page)
        .then((result) => {
          if (result.throwable) {
            throw result.throwable;
          }

          const content = result.data!!;
          setContent((oldContent) => {
            const newContent = oldContent
              ? oldContent.filter(
                  (element) => !(element instanceof ContentLoadingEntity),
                )
              : [];

            newContent.push(...content);

            if (result.hasNext) {
              newContent.push(ContentLoadingEntity.newInstance());
            }

            return newContent;
          });

          setErrorMessage(undefined);
          isFetching.current = false;
        })
        .catch((error) => {
          setErrorMessage(Assets.Strings.ERROR(error));
          setContent(undefined);
          isFetching.current = false;
        });
    }, []);

    const renderItem = React.useCallback(
      (entity: Entity, index: number) => entityToComponent(entity, index),
      [],
    );

    const flatListProps: FlatListProps<Entity> = {
      data: content,
      keyExtractor: (item: Entity) => item.key,
      onEndReachedThreshold: 0.1,
      onEndReached: () => {
        if (
          content &&
          content.length > 0 &&
          content[content.length - 1] instanceof ContentLoadingEntity
        ) {
          fetchContent(currentPage.current++);
        }
      },
      renderItem: ({item, index}) => renderItem(item, index),
    };

    React.useEffect(() => refreshContent(), [refreshState]);

    return (
      <View style={{flex: 1}}>
        {errorMessage && <EmptyContentComponent message={errorMessage} />}
        {layoutType === PaginatedContentLayoutType.HORIZONTAL ? (
          <FlatList {...flatListProps} horizontal={true} />
        ) : null}
        {layoutType === PaginatedContentLayoutType.VERTICAL ? (
          <FlatList {...flatListProps} />
        ) : null}
        {layoutType === PaginatedContentLayoutType.GRID ||
        layoutType === undefined ? (
          <FlatList
            {...flatListProps}
            key={itemsPerRow}
            numColumns={itemsPerRow}
            onRefresh={refreshContent}
            refreshing={false}
          />
        ) : null}
      </View>
    );
  },
);
