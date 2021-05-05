import {EntityKey} from '../entities';

export interface FavoriteContentService {
  init(): Promise<boolean>;

  isFavorited(key: string): boolean;

  toggle(key: string): Promise<boolean>;

  favorites: Array<EntityKey>;
}
