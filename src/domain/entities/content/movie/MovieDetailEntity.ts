import {ValueHelper} from '../../../utils';
import {BaseEntity, Entity, EntityType} from '../../Entity';
import {ImageEntity} from '../../misc/ImageEntity';

export interface MovieDetailEntityProps {
  id: string;
  title: string;
  overview: string;
  releaseYear: string;
  runtime: number;
  countryCode: string;
  genres: string[];
  posterImageUrls: ImageEntity[];
  backdropImageUrls: ImageEntity[];
}

export class MovieDetailEntity extends BaseEntity implements Entity {
  static ClassName = 'MovieDetailEntity';

  public readonly title: string = '';
  public readonly overview: string = '';
  public readonly releaseYear: string = '';
  public readonly runtime: number = 0;
  public readonly countryCode: string = '';
  public readonly genres: string[] = [];
  public readonly posterImageUrls: ImageEntity[];
  public readonly backdropImageUrls: ImageEntity[];

  constructor({
    id,
    title,
    overview,
    releaseYear,
    runtime,
    countryCode,
    genres,
    posterImageUrls,
    backdropImageUrls,
  }: MovieDetailEntityProps) {
    super(MovieDetailEntity.ClassName, EntityType.MOVIE, id);

    this.title = ValueHelper.requireValue(
      title,
      'title cannot be null or empty',
    )!!;
    this.overview = ValueHelper.missingToDefault(
      overview,
      'Overview not available',
    )!!;
    this.releaseYear = ValueHelper.missingToDefault(releaseYear, '')!!;
    this.runtime = runtime;
    this.countryCode = ValueHelper.missingToDefault(countryCode, '')!!;
    this.genres = genres;
    this.posterImageUrls = posterImageUrls;
    this.backdropImageUrls = backdropImageUrls;
  }
}
