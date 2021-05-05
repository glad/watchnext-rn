import {ValueHelper} from '../../utils';
import {BaseEntity, Entity, EntityType} from '../Entity';

export interface ImageEntityProps {
  width: number;
  url: string;
}

export class ImageEntity extends BaseEntity implements Entity {
  static ClassName = 'ImageEntity';

  public readonly width: number = 0;
  public readonly url: string = '';

  constructor({width, url}: ImageEntityProps) {
    super(ImageEntity.ClassName, EntityType.IMAGE, url);

    this.width = width;
    this.url = ValueHelper.requireValue(url, 'url cannot be null or empty')!!;
  }
}
