import {ImageEntity} from '../entities';

export interface ImageUrlProvider {
  getUrl(Urls: ImageEntity[], width?: number): string | undefined;
}
