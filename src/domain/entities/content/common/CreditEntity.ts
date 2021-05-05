import {ValueHelper} from '../../../utils';
import {BaseEntity, Entity, EntityType} from '../../Entity';
import {ImageEntity} from '../../misc/ImageEntity';

export interface CreditEntityProps {
  id: string;
  name: string;
  role: string;
  profileImageUrls: ImageEntity[];
}

export class CreditEntity extends BaseEntity implements Entity {
  static ClassName = 'CreditEntity';
  public readonly name: string = '';
  public readonly role: string = '';
  public readonly profileImageUrls: ImageEntity[];

  constructor({id, name, role, profileImageUrls}: CreditEntityProps) {
    super(CreditEntity.ClassName, EntityType.PERSON, id);

    this.name = ValueHelper.requireValue(
      name,
      'name cannot be null or empty',
    )!!;
    this.role = ValueHelper.missingToDefault(role, 'Role not available')!!;
    this.profileImageUrls = profileImageUrls;
  }
}
