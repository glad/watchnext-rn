import {ValueHelper} from '../../../utils';
import {BaseEntity, Entity, EntityType} from '../../Entity';
import {ImageEntity} from '../../misc/ImageEntity';

export interface EpisodeSimpleEntityProps {
  tvShowId: string;
  season: number;
  episode: number;
  name: string;
  overview: string;
  stillImageUrls: ImageEntity[];
}

export class EpisodeSimpleEntity extends BaseEntity implements Entity {
  static ClassName = 'EpisodeSimpleEntity';

  public readonly tvShowId: string = '';
  public readonly season: number = 0;
  public readonly episode: number = 0;
  public readonly name: string = '';
  public readonly overview: string = '';
  public readonly stillImageUrls: ImageEntity[];

  constructor({
    tvShowId,
    season,
    episode,
    name,
    overview,
    stillImageUrls,
  }: EpisodeSimpleEntityProps) {
    super(
      EpisodeSimpleEntity.ClassName,
      EntityType.TVSHOW_EPISODE,
      `${tvShowId}${season}${episode}`,
    );

    this.tvShowId = ValueHelper.requireValue(
      tvShowId,
      'tvShowId cannot be null or empty',
    )!!;
    this.season = season;
    this.episode = episode;
    this.name = ValueHelper.requireValue(
      name,
      'name cannot be null or empty',
    )!!;
    this.overview = ValueHelper.missingToDefault(
      overview,
      'Overview not available',
    )!!;
    this.stillImageUrls = stillImageUrls;
  }
}
