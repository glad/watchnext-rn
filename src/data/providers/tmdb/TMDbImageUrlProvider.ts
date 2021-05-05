import {ImageEntity} from '@watchnext-domain/entities';
import {ImageUrlProvider} from '@watchnext-domain/providers';
import {Logger} from '@watchnext-domain/utils';

export class TMDbImageUrlProvider implements ImageUrlProvider {
  private logger: Logger;

  constructor(logger: Logger) {
    this.logger = logger;
  }

  public getUrl(urls: ImageEntity[], width?: number): string | undefined {
    if (urls.length === 1) {
      return urls[0].url;
    } else if (urls.length > 1 && width !== undefined) {
      try {
        const widths = urls.map((entity) => entity.width);

        const closest = widths.reduce(function (prev, curr) {
          return Math.abs(curr - width) < Math.abs(prev - width) ? curr : prev;
        });

        return urls.find((entity) => entity.width === closest)!!.url;
      } catch (error) {
        this.logger.w('Failed to get url', error);
      }
    }

    return undefined;
  }
}
