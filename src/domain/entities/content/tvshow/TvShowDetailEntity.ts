import {ValueHelper} from '../../../utils';
import {BaseEntity, Entity, EntityType} from '../../Entity';
import {ImageEntity} from '../../misc/ImageEntity';

export interface TvShowDetailEntityProps {
  id: string;
  name: string;
  overview: string;
  releaseYear: string;
  seasonCount: number;
  countryCode: string;
  genres: string[];
  posterImageUrls: ImageEntity[];
  backdropImageUrls: ImageEntity[];
}

export class TvShowDetailEntity extends BaseEntity implements Entity {
  static ClassName = 'TvShowDetailEntity';

  public readonly name: string = '';
  public readonly overview: string = '';
  public readonly releaseYear: string = '';
  public readonly seasonCount: number = 0;
  public readonly countryCode: string = '';
  public readonly genres: string[] = [];
  public readonly posterImageUrls: ImageEntity[];
  public readonly backdropImageUrls: ImageEntity[];

  constructor({
    id,
    name,
    overview,
    releaseYear,
    seasonCount,
    countryCode,
    genres,
    posterImageUrls,
    backdropImageUrls,
  }: TvShowDetailEntityProps) {
    super(TvShowDetailEntity.ClassName, EntityType.TVSHOW, id);

    this.name = ValueHelper.requireValue(
      name,
      'name cannot be null or empty',
    )!!;
    this.overview = ValueHelper.missingToDefault(
      overview,
      'Overview not available',
    )!!;
    this.releaseYear = ValueHelper.missingToDefault(releaseYear, '')!!;
    this.seasonCount = seasonCount;
    this.countryCode = ValueHelper.missingToDefault(countryCode, '')!!;
    this.genres = genres;
    this.posterImageUrls = posterImageUrls;
    this.backdropImageUrls = backdropImageUrls;
  }
}
