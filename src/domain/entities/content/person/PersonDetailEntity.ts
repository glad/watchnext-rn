import {ValueHelper} from '../../../utils';
import {BaseEntity, Entity, EntityType} from '../../Entity';
import {ImageEntity} from '../../misc/ImageEntity';

export interface PersonDetailEntityProps {
  id: string;
  name: string;
  biography: string;
  birthDateTimestamp: number;
  placeOfBirth: string;
  deathDateTimestamp: number;
  profileImageUrls: ImageEntity[];
}

export class PersonDetailEntity extends BaseEntity implements Entity {
  static ClassName = 'PersonDetailEntity';

  public readonly name: string = '';
  public readonly biography: string = '';
  public readonly birthDateTimestamp: number = 0;
  public readonly placeOfBirth: string = '';
  public readonly deathDateTimestamp: number = 0;
  public readonly profileImageUrls: ImageEntity[];

  constructor({
    id,
    name,
    biography,
    birthDateTimestamp,
    placeOfBirth,
    deathDateTimestamp,
    profileImageUrls,
  }: PersonDetailEntityProps) {
    super(PersonDetailEntity.ClassName, EntityType.PERSON, id);

    this.name = ValueHelper.requireValue(
      name,
      'name cannot be null or empty',
    )!!;
    this.biography = ValueHelper.missingToDefault(
      biography,
      'Biography not available',
    )!!;
    this.birthDateTimestamp = birthDateTimestamp;
    this.placeOfBirth = ValueHelper.missingToDefault(placeOfBirth, '')!!;
    this.deathDateTimestamp = deathDateTimestamp;
    this.profileImageUrls = profileImageUrls;
  }
}
