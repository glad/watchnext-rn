import {ValueHelper} from '../../../utils';
import {BaseEntity, Entity, EntityType} from '../../Entity';
import {ImageEntity} from '../../misc/ImageEntity';

export interface TvShowSimpleEntityProps {
  id: string;
  name: string;
  overview: string;
  releaseYear: string;
  posterImageUrls: ImageEntity[];
  backdropImageUrls: ImageEntity[];
}

export class TvShowSimpleEntity extends BaseEntity implements Entity {
  static ClassName = 'TvShowSimpleEntity';

  public readonly name: string = '';
  public readonly overview: string = '';
  public readonly releaseYear: string = '';
  public readonly posterImageUrls: ImageEntity[];
  public readonly backdropImageUrls: ImageEntity[];

  constructor({
    id,
    name,
    overview,
    releaseYear,
    posterImageUrls,
    backdropImageUrls,
  }: TvShowSimpleEntityProps) {
    super(TvShowSimpleEntity.ClassName, EntityType.TVSHOW, id);

    this.name = ValueHelper.requireValue(
      name,
      'name cannot be null or empty',
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
