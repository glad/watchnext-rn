import {ValueHelper} from '../../../utils';
import {BaseEntity, Entity, EntityType} from '../../Entity';
import {ImageEntity} from '../../misc/ImageEntity';

export interface MovieSimpleEntityProps {
  id: string;
  title: string;
  overview: string;
  releaseYear: string;
  posterImageUrls: ImageEntity[];
  backdropImageUrls: ImageEntity[];
}

export class MovieSimpleEntity extends BaseEntity implements Entity {
  static ClassName = 'MovieSimpleEntity';

  public readonly title: string = '';
  public readonly overview: string = '';
  public readonly releaseYear: string = '';
  public readonly posterImageUrls: ImageEntity[];
  public readonly backdropImageUrls: ImageEntity[];

  constructor({
    id,
    title,
    overview,
    releaseYear,
    posterImageUrls,
    backdropImageUrls,
  }: MovieSimpleEntityProps) {
    super(MovieSimpleEntity.ClassName, EntityType.MOVIE, id);

    this.title = ValueHelper.requireValue(
      title,
      'title cannot be null or empty',
    )!!;
    this.overview = ValueHelper.missingToDefault(
      overview,
      'Overview not available',
    )!!;
    this.releaseYear = ValueHelper.missingToDefault(releaseYear, '')!!;
    this.posterImageUrls = posterImageUrls;
    this.backdropImageUrls = backdropImageUrls;
  }
}
