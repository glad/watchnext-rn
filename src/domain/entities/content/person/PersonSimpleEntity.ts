import {ValueHelper} from '../../../utils';
import {BaseEntity, Entity, EntityType} from '../../Entity';
import {ImageEntity} from '../../misc/ImageEntity';

export interface PersonSimpleEntityProps {
  id: string;
  name: string;
  profileImageUrls: ImageEntity[];
}

export class PersonSimpleEntity extends BaseEntity implements Entity {
  static ClassName = 'PersonSimpleEntity';

  public readonly name: string = '';
  public readonly profileImageUrls: ImageEntity[];

  constructor({id, name, profileImageUrls}: PersonSimpleEntityProps) {
    super(PersonSimpleEntity.ClassName, EntityType.PERSON, id);

    this.name = ValueHelper.requireValue(
      name,
      'name cannot be null or empty',
    )!!;
    this.profileImageUrls = profileImageUrls;
  }
}
