import {ValueHelper} from '../../../utils';
import {BaseEntity, Entity, EntityType} from '../../Entity';
import {ImageEntity} from '../../misc/ImageEntity';

export interface EpisodeDetailEntityProps {
  tvShowId: string;
  season: number;
  episode: number;
  name: string;
  overview: string;
  stillImageUrls: ImageEntity[];
}

export class EpisodeDetailEntity extends BaseEntity implements Entity {
  static ClassName = 'EpisodeDetailEntity';

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
  }: EpisodeDetailEntityProps) {
    super(
      EpisodeDetailEntity.ClassName,
      EntityType.TVSHOW_EPISODE,
      episode.toString(),
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
