import {
  CreditEntity,
  Entity,
  EpisodeDetailEntity,
  MovieDetailEntity,
  MovieSimpleEntity,
  PersonDetailEntity,
  PersonSimpleEntity,
  TvShowDetailEntity,
  TvShowSimpleEntity,
} from '@watchnext-domain/entities';
import React from 'react';
import {Share} from 'react-native';
import {Assets} from '../assets';
import {OnActionProps} from '../components/OnActionProps';
import {useAppContext, useDependencyContext} from '../contexts';
import {useAppNavigation} from './useAppNavigation';

export const useOnAction = () => {
  const {favoriteContentService, logger} = useDependencyContext();
  const {setFavoriteContentRefreshState} = useAppContext();

  const {
    navigateToMovieDetail,
    navigateToTvShowEpisodeDetail,
    navigateToTvShowDetail,
    navigateToPersonDetail,
  } = useAppNavigation();

  const onAction: OnActionProps = {
    onLoad: React.useCallback(
      (
        action: string,
        entity: Entity,
        resultCallback?: (result: any) => void,
      ) => {
        if (action === 'FavoriteContent') {
          resultCallback?.(favoriteContentService.isFavorited(entity.key));
        }
      },
      [],
    ),
    onPress: React.useCallback(
      (action: string, params: any, resultCallback?: (result: any) => void) => {
        switch (action) {
          case 'OpenToDetail':
            {
              setTimeout(() => {
                if (
                  params instanceof MovieSimpleEntity ||
                  params instanceof MovieDetailEntity
                ) {
                  navigateToMovieDetail(params.id);
                } else if (
                  params instanceof TvShowSimpleEntity ||
                  params instanceof TvShowDetailEntity
                ) {
                  navigateToTvShowDetail(params.id);
                } else if (params instanceof EpisodeDetailEntity) {
                  navigateToTvShowEpisodeDetail(
                    params.tvShowId,
                    params.season,
                    params.episode,
                  );
                } else if (
                  params instanceof PersonSimpleEntity ||
                  params instanceof PersonDetailEntity ||
                  params instanceof CreditEntity
                ) {
                  navigateToPersonDetail(params.id);
                }
              }, 50);
            }
            return;
          case 'FavoriteContent':
            {
              (async () => {
                await favoriteContentService
                  .toggle(params.key)
                  .then((result) => {
                    resultCallback?.(result);
                    setFavoriteContentRefreshState((old: number) => old + 1);
                  });
              })();
            }
            return;
          case 'Share':
            (async () => {
              try {
                const message = Assets.Strings.SHARE(params);
                if (message === undefined) {
                  throw new Error('Message not available');
                }
                const result = await Share.share({message: message});
                if (result.action === Share.sharedAction) {
                  if (result.activityType) {
                    // shared with activity type of result.activityType
                  } else {
                    // shared
                  }
                } else if (result.action === Share.dismissedAction) {
                  // dismissed
                }
              } catch (error) {
                logger.e(error);
              }
            })();
            return;
          default:
            return;
        }
      },
      [],
    ),
  };

  return {
    onAction,
  };
};
