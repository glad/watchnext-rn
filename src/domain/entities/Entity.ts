export enum EntityType {
  MOVIE = 'movie',

  TVSHOW = 'tvshow',
  TVSHOW_SEASON = 'tvshow_season',
  TVSHOW_EPISODE = 'tvshow_episode',

  PERSON = 'person',

  IMAGE = 'image',

  UNKNOWN = 'unknown',
}

export class EntityKey {
  public readonly className: string;
  public readonly type: EntityType;
  public readonly id: string;
  public readonly asString: string;

  constructor(className: string, type: EntityType, id: string) {
    this.className = className;
    this.type = type;
    this.id = id;

    this.asString = JSON.stringify(this);
  }

  static fromJson(json: string): EntityKey | undefined {
    try {
      const obj: any = JSON.parse(json);
      return new EntityKey(obj.className, obj.type, obj.id);
    } catch (error) {
      return undefined;
    }
  }
}

export interface Entity {
  className: string;
  type: EntityType;
  id: string;
  key: string;
}

export class BaseEntity implements Entity {
  private readonly _key: EntityKey;

  constructor(className: string, type: EntityType, id: string) {
    this._key = new EntityKey(className, type, id);
  }

  public get className() {
    return this._key.className;
  }

  public get type() {
    return this._key.type;
  }

  public get id() {
    return this._key.id;
  }

  public get key() {
    return this._key.asString;
  }
}
