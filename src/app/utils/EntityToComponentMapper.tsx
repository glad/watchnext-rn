import {
  ContentLoadingEntity,
  CreditEntity,
  Entity,
  EpisodeDetailEntity,
  EpisodeSimpleEntity,
  ImageEntity,
  MovieDetailEntity,
  MovieSimpleEntity,
  PersonCreditEntity,
  PersonDetailEntity,
  PersonSimpleEntity,
  TvShowDetailEntity,
  TvShowSimpleEntity,
} from '@watchnext-domain/entities';
import {ImageUrlProvider} from '@watchnext-domain/providers';
import {DateUtil} from '@watchnext-domain/utils';
import React from 'react';
import {Assets} from '../assets';
import {ContentLoadingComponent} from '../components/ContentLoadingComponent';
import {DetailOverviewComponentExtraProps} from '../components/DetailOverviewComponent';
import {EpisodeDetailOverviewComponent} from '../components/EpisodeDetailOverviewComponent';
import {
  FetchDetailContentProps,
  FetchMovieDetailContentProps,
  FetchPersonDetailContentProps,
  FetchTvShowDetailContentProps,
  FetchTvShowEpisodeDetailContentProps,
} from '../components/FetchDetailContentProps';
import {MovieDetailOverviewComponent} from '../components/MovieDetailOverviewComponent';
import {OnActionProps} from '../components/OnActionProps';
import {PersonDetailOverviewComponent} from '../components/PersonDetailOverviewComponent';
import {SimpleContentCardComponent} from '../components/SimpleContentCardComponent';
import {ThumbnailContentComponent} from '../components/ThumbnailContentComponent';
import {TvShowDetailOverviewComponent} from '../components/TvShowDetailOverviewComponent';

export class EntityToComponentMapper {
  private imageUrlProvider: ImageUrlProvider;
  private readonly dateUtil: DateUtil;

  constructor(imageUrlProvider: ImageUrlProvider, dateUtil: DateUtil) {
    this.imageUrlProvider = imageUrlProvider;
    this.dateUtil = dateUtil;
  }

  public toThumbnail(
    entity: Entity,
    index: number,
    onPress: (params: any) => void,
  ): React.ReactElement {
    if (
      entity instanceof MovieSimpleEntity ||
      entity instanceof MovieDetailEntity
    ) {
      return (
        <ThumbnailContentComponent
          index={index || 0}
          id={entity.id}
          type={entity.type}
          thumbnailUrl={this.imageUrlProvider.getUrl(
            entity.posterImageUrls,
            Assets.Dimensions.ImageQuality.THUMBNAIL_NORMAL,
          )}
          placeholderText={entity.title}
          onPress={() => onPress(new FetchMovieDetailContentProps(entity.id))}
        />
      );
    } else if (
      entity instanceof TvShowSimpleEntity ||
      entity instanceof TvShowDetailEntity
    ) {
      return (
        <ThumbnailContentComponent
          index={index || 0}
          id={entity.id}
          type={entity.type}
          thumbnailUrl={this.imageUrlProvider.getUrl(
            entity.posterImageUrls,
            Assets.Dimensions.ImageQuality.THUMBNAIL_NORMAL,
          )}
          placeholderText={entity.name}
          onPress={() => onPress(new FetchTvShowDetailContentProps(entity.id))}
        />
      );
    } else if (
      entity instanceof PersonSimpleEntity ||
      entity instanceof PersonDetailEntity ||
      entity instanceof CreditEntity
    ) {
      return (
        <ThumbnailContentComponent
          index={index || 0}
          id={entity.id}
          type={entity.type}
          thumbnailUrl={this.imageUrlProvider.getUrl(
            entity.profileImageUrls,
            Assets.Dimensions.ImageQuality.THUMBNAIL_NORMAL,
          )}
          placeholderText={entity.name}
          onPress={() => onPress(new FetchPersonDetailContentProps(entity.id))}
        />
      );
    } else if (entity instanceof PersonCreditEntity) {
      let posterImageUrls: ImageEntity[] = [];
      let placeholderText = '';
      let onPressCallback = () => {};

      const detail = entity.detail;

      if (detail instanceof MovieSimpleEntity) {
        posterImageUrls = detail.posterImageUrls;
        placeholderText = detail.title;
        onPressCallback = () =>
          onPress(new FetchMovieDetailContentProps(detail.id));
      } else if (detail instanceof TvShowSimpleEntity) {
        posterImageUrls = detail.posterImageUrls;
        placeholderText = detail.name;
        onPressCallback = () =>
          onPress(new FetchTvShowDetailContentProps(detail.id));
      }

      return (
        <ThumbnailContentComponent
          index={index || 0}
          id={entity.id}
          type={entity.type}
          thumbnailUrl={this.imageUrlProvider.getUrl(
            posterImageUrls,
            Assets.Dimensions.ImageQuality.THUMBNAIL_NORMAL,
          )}
          placeholderText={placeholderText}
          onPress={onPressCallback}
        />
      );
    } else if (
      entity instanceof EpisodeSimpleEntity ||
      entity instanceof EpisodeDetailEntity
    ) {
      return (
        <ThumbnailContentComponent
          index={index || 0}
          id={entity.id}
          type={entity.type}
          thumbnailUrl={this.imageUrlProvider.getUrl(
            entity.stillImageUrls,
            Assets.Dimensions.ImageQuality.THUMBNAIL_NORMAL,
          )}
          placeholderText={entity.name}
          onPress={() =>
            onPress(
              new FetchTvShowEpisodeDetailContentProps(
                entity.tvShowId,
                entity.season,
                entity.episode,
              ),
            )
          }
        />
      );
    } else if (entity instanceof ContentLoadingEntity) {
      return <ContentLoadingComponent />;
    } else {
      throw new Error(`toThumbnail: Failed to map ${entity} to a component`);
    }
  }

  public toSimpleContentCard(
    entity: Entity,
    index: number,
    onPress: (params: any) => void,
  ): React.ReactElement {
    if (entity instanceof CreditEntity) {
      return (
        <SimpleContentCardComponent
          index={index || 0}
          id={entity.id}
          type={entity.type}
          primaryTitle={entity.name}
          secondaryTitle={entity.role}
          thumbnailUrl={this.imageUrlProvider.getUrl(
            entity.profileImageUrls,
            Assets.Dimensions.ImageQuality.THUMBNAIL_NORMAL,
          )}
          onPress={() => onPress(new FetchPersonDetailContentProps(entity.id))}
        />
      );
    } else if (entity instanceof PersonCreditEntity) {
      let posterImageUrls: ImageEntity[] = [];
      let primaryTitle = '';
      let onPressProps: FetchDetailContentProps | undefined = undefined;
      const detail = entity.detail;

      if (detail instanceof MovieSimpleEntity) {
        const releaseYear =
          detail.releaseYear === '' ? '' : ` (${detail.releaseYear})`;
        posterImageUrls = detail.posterImageUrls;
        primaryTitle = `${detail.title}${releaseYear}`;
        onPressProps = new FetchMovieDetailContentProps(entity.id);
      } else if (detail instanceof TvShowSimpleEntity) {
        const releaseYear =
          detail.releaseYear === '' ? '' : ` (${detail.releaseYear})`;
        posterImageUrls = detail.posterImageUrls;
        primaryTitle = `${detail.name}${releaseYear}`;
        onPressProps = new FetchTvShowDetailContentProps(entity.id);
      }

      return (
        <SimpleContentCardComponent
          index={index || 0}
          id={entity.id}
          type={entity.type}
          primaryTitle={primaryTitle}
          secondaryTitle={entity.role}
          thumbnailUrl={this.imageUrlProvider.getUrl(
            posterImageUrls,
            Assets.Dimensions.ImageQuality.THUMBNAIL_NORMAL,
          )}
          onPress={() => onPressProps && onPress(onPressProps)}
        />
      );
    } else if (
      entity instanceof EpisodeSimpleEntity ||
      entity instanceof EpisodeDetailEntity
    ) {
      return (
        <SimpleContentCardComponent
          index={index || 0}
          id={entity.id}
          type={entity.type}
          primaryTitle={entity.name}
          secondaryTitle={(() => {
            const season = entity.season > 0 ? `Season ${entity.season}` : '';
            const episode =
              entity.season > 0 ? `Episode ${entity.episode}` : '';
            return `${season} ${episode}`.trim();
          })()}
          thumbnailUrl={this.imageUrlProvider.getUrl(
            entity.stillImageUrls,
            Assets.Dimensions.ImageQuality.THUMBNAIL_NORMAL,
          )}
          landscape={true}
          onPress={() =>
            onPress(
              new FetchTvShowEpisodeDetailContentProps(
                entity.tvShowId,
                entity.season,
                entity.episode,
              ),
            )
          }
        />
      );
    } else if (entity instanceof ContentLoadingEntity) {
      return <ContentLoadingComponent />;
    } else {
      throw new Error(
        `toSimpleContentCard: Failed to map ${entity} to a component`,
      );
    }
  }

  public toDetailOverview(
    entity: Entity,
    onAction?: OnActionProps,
    detailOverviewComponentExtraProps?: DetailOverviewComponentExtraProps,
  ): React.ReactElement {
    if (entity instanceof MovieDetailEntity) {
      return (
        <MovieDetailOverviewComponent
          {...detailOverviewComponentExtraProps}
          key={entity.key}
          index={0}
          entity={entity}
          id={entity.id}
          title={entity.title}
          overview={entity.overview}
          thumbnailUrl={this.imageUrlProvider.getUrl(
            entity.posterImageUrls,
            Assets.Dimensions.ImageQuality.THUMBNAIL_NORMAL,
          )}
          backdropUrl={this.imageUrlProvider.getUrl(
            entity.backdropImageUrls,
            Assets.Dimensions.ImageSize.BACKDROP,
          )}
          metadata={(() => {
            const metadata = new Array();
            metadata.push(
              `${entity.releaseYear} - ${entity.countryCode} - ${entity.runtime} min.`,
            );
            try {
              metadata.push(entity.genres.join(', '));
            } catch (error) {}
            return metadata;
          })()}
          onAction={onAction}
        />
      );
    } else if (entity instanceof TvShowDetailEntity) {
      return (
        <TvShowDetailOverviewComponent
          {...detailOverviewComponentExtraProps}
          key={entity.key}
          index={0}
          entity={entity}
          id={entity.id}
          name={entity.name}
          overview={entity.overview}
          thumbnailUrl={this.imageUrlProvider.getUrl(
            entity.posterImageUrls,
            Assets.Dimensions.ImageQuality.THUMBNAIL_NORMAL,
          )}
          metadata={(() => {
            const metadata = new Array();
            const suffix = entity.seasonCount === 1 ? 'season' : 'season';
            metadata.push(
              `${entity.releaseYear} - ${entity.countryCode} - ${entity.seasonCount} ${suffix}`,
            );
            try {
              metadata.push(entity.genres.join(', '));
            } catch (error) {}
            return metadata;
          })()}
          onAction={onAction}
        />
      );
    } else if (entity instanceof EpisodeDetailEntity) {
      return (
        <EpisodeDetailOverviewComponent
          {...detailOverviewComponentExtraProps}
          key={entity.key}
          index={0}
          entity={entity}
          id={entity.id}
          name={entity.name}
          overview={entity.overview}
          thumbnailUrl={this.imageUrlProvider.getUrl(
            entity.stillImageUrls,
            Assets.Dimensions.ImageQuality.THUMBNAIL_NORMAL,
          )}
          metadata={(() => {
            const metadata = new Array();
            try {
              const season = entity.season > 0 ? `Season ${entity.season}` : '';
              const episode =
                entity.season > 0 ? `Episode ${entity.episode}` : '';

              metadata.push(`${season} ${episode}`.trim());
            } catch (error) {}
            return metadata;
          })()}
          onAction={onAction}
        />
      );
    } else if (entity instanceof PersonDetailEntity) {
      return (
        <PersonDetailOverviewComponent
          {...detailOverviewComponentExtraProps}
          key={entity.key}
          index={0}
          entity={entity}
          id={entity.id}
          name={entity.name}
          biography={entity.biography}
          thumbnailUrl={this.imageUrlProvider.getUrl(
            entity.profileImageUrls,
            Assets.Dimensions.ImageQuality.THUMBNAIL_NORMAL,
          )}
          metadata={(() => {
            const metadata = new Array();
            try {
              const nowDate = this.dateUtil.nowTimestamp;
              const birthDate = entity.birthDateTimestamp;
              const deathDate = entity.deathDateTimestamp;
              const age = (() => {
                try {
                  if (deathDate === 0 && birthDate !== 0) {
                    return this.dateUtil.diffYears(nowDate, birthDate);
                  } else if (deathDate !== 0 && birthDate !== 0) {
                    return this.dateUtil.diffYears(deathDate, birthDate);
                  }
                } catch (error) {}
                return 0;
              })();
              const ageDisplay = age === 0 ? '' : ` (age ${age})`;

              if (birthDate !== 0) {
                const dateDisplay = this.dateUtil.formatTimestamp(
                  birthDate,
                  'MMM. Do, YYYY',
                );
                metadata.push(
                  `Born: ${dateDisplay}${deathDate === 0 ? ageDisplay : ''}`,
                );
              }
              if (deathDate !== 0) {
                const dateDisplay = this.dateUtil.formatTimestamp(
                  deathDate,
                  'MMM. Do, YYYY',
                );
                metadata.push(`Died: ${dateDisplay}${ageDisplay}`);
              }
              metadata.push(entity.placeOfBirth);
            } catch (error) {
              console.error(error);
            }
            return metadata;
          })()}
          onAction={onAction}
        />
      );
    } else if (entity instanceof ContentLoadingEntity) {
      return <ContentLoadingComponent />;
    } else {
      throw new Error(`toDetail: Failed to map ${entity} to a component`);
    }
  }
}
