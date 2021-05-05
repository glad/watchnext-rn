import {ValueHelper} from '../../../utils';
import {BaseEntity, Entity} from '../../Entity';

export interface PersonCreditEntityProps {
  role: string;
  detail: Entity;
}

export class PersonCreditEntity extends BaseEntity implements Entity {
  static ClassName = 'PersonCreditEntity';

  public readonly role: string = '';
  public readonly detail: Entity;

  constructor({detail, role}: PersonCreditEntityProps) {
    super(PersonCreditEntity.ClassName, detail.type, detail.id);
    this.role = ValueHelper.missingToDefault(role, 'Role not available')!!;
    this.detail = detail;
  }
}
