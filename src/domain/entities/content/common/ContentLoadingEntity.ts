import {BaseEntity, Entity, EntityType} from '../../Entity';

export class ContentLoadingEntity extends BaseEntity implements Entity {
  static ClassName = 'ContentLoadingEntity';
  static ID_COUNTER = 0;

  private constructor() {
    super(
      ContentLoadingEntity.ClassName,
      EntityType.UNKNOWN,
      `${++ContentLoadingEntity.ID_COUNTER}`,
    );
  }

  public static newInstance = () => new ContentLoadingEntity();
}
