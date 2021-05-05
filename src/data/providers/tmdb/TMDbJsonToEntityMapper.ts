import {
  CreditEntity,
  Entity,
  EpisodeDetailEntity,
  ImageEntity,
  MovieDetailEntity,
  MovieSimpleEntity,
  PersonCreditEntity,
  PersonDetailEntity,
  PersonSimpleEntity,
  TvShowDetailEntity,
  TvShowSimpleEntity,
} from '@watchnext-domain/entities';
import {Result} from '@watchnext-domain/misc';
import {ContentFailedToLoadThrowable} from '@watchnext-domain/throwables';
import {EpisodeSimpleEntity} from './../../../domain/entities/content/episode/EpisodeSimpleEntity';
import {DateUtil} from './../../../domain/utils/DateUtil';

type TMDbConfiguration = {
  baseImageUrl: string;
  posterImageSizeMap: Map<number, string>;
  backdropImageSizeMap: Map<number, string>;
  profileImageSizeMap: Map<number, string>;
  stillImageSizeMap: Map<number, string>;
};

type TMDbApiPagedResponse<T> = {
  readonly page: number;
  readonly results: T[];
  readonly total_pages: number;
  readonly total_results: number;
};

export class TMDbJsonToEntityMapper {
  private configuration?: TMDbConfiguration;
  private readonly dateUtil: DateUtil;

  constructor(dateUtil: DateUtil) {
    this.dateUtil = dateUtil;
  }

  public setConfiguration(json: any) {
    try {
      const sizeMapper = (sizes: string[]) => {
        var map = new Map<number, string>();
        sizes.forEach((element) => {
          const numeric = parseInt(element.replace(/[^\d+]/i, ''));
          map.set(isNaN(numeric) ? 0 : numeric, element);
        });
        return map;
      };

      this.configuration = {
        baseImageUrl: json.images.base_url,
        posterImageSizeMap: sizeMapper(json.images.poster_sizes),
        backdropImageSizeMap: sizeMapper(json.images.backdrop_sizes),
        profileImageSizeMap: sizeMapper(json.images.profile_sizes),
        stillImageSizeMap: sizeMapper(json.images.still_sizes),
      };
      return true;
    } catch (error) {
      throw error;
    }
  }

  private toReleaseDate(input: string): string {
    try {
      return input.substring(0, 4);
    } catch (error) {}
    return '';
  }

  private toProductionCountry(input: any[]): string {
    try {
      return input[0].iso_3166_1;
    } catch (error) {}
    return '';
  }

  private toGenres(input: []): string[] {
    try {
      return input.map((element: any) => element.name);
    } catch (error) {}
    return [];
  }

  private toImagePath(
    map: Map<number, string> | undefined,
    imagePath: string,
  ): ImageEntity[] {
    const urls = new Array<ImageEntity>();

    try {
      const configuration = this.configuration;
      if (configuration !== undefined && map !== undefined) {
        map.forEach((value, key) => {
          urls.push(
            new ImageEntity({
              width: key,
              url: configuration.baseImageUrl + value + imagePath,
            }),
          );
        });
      }
    } catch (error) {
      // No-op
    }

    return urls;
  }

  private toPosterImagePath(imagePath: string): ImageEntity[] {
    return this.toImagePath(this.configuration?.posterImageSizeMap, imagePath);
  }

  private toBackdropImagePath(imagePath: string): ImageEntity[] {
    return this.toImagePath(
      this.configuration?.backdropImageSizeMap,
      imagePath,
    );
  }

  private toProfileImagePath(imagePath: string): ImageEntity[] {
    return this.toImagePath(this.configuration?.profileImageSizeMap, imagePath);
  }

  private toStillImagePath(imagePath: string): ImageEntity[] {
    return this.toImagePath(this.configuration?.stillImageSizeMap, imagePath);
  }

  public toMovieSimple(json: any): MovieSimpleEntity {
    return new MovieSimpleEntity({
      id: json.id.toString(),
      title: json.title,
      overview: json.overview,
      releaseYear: this.toReleaseDate(json.release_date),
      posterImageUrls: this.toPosterImagePath(json.poster_path),
      backdropImageUrls: this.toBackdropImagePath(json.backdrop_path),
    });
  }

  public toMovieDetail(json: any): MovieDetailEntity {
    return new MovieDetailEntity({
      id: json.id.toString(),
      title: json.title,
      overview: json.overview,
      releaseYear: this.toReleaseDate(json.release_date),
      runtime: json.runtime,
      countryCode: this.toProductionCountry(json.production_countries),
      genres: this.toGenres(json.genres),
      posterImageUrls: this.toPosterImagePath(json.poster_path),
      backdropImageUrls: this.toBackdropImagePath(json.backdrop_path),
    });
  }

  public toTvShowSimple(json: any): TvShowSimpleEntity {
    return new TvShowSimpleEntity({
      id: json.id.toString(),
      name: json.name,
      overview: json.overview,
      releaseYear: this.toReleaseDate(json.first_air_date),
      posterImageUrls: this.toPosterImagePath(json.poster_path),
      backdropImageUrls: this.toBackdropImagePath(json.backdrop_path),
    });
  }

  public toTvShowDetail(json: any): TvShowDetailEntity {
    return new TvShowDetailEntity({
      id: json.id.toString(),
      name: json.name,
      overview: json.overview,
      releaseYear: this.toReleaseDate(json.first_air_date),
      seasonCount: json.number_of_seasons,
      countryCode: this.toProductionCountry(json.production_countries),
      genres: this.toGenres(json.genres),
      posterImageUrls: this.toPosterImagePath(json.poster_path),
      backdropImageUrls: this.toBackdropImagePath(json.backdrop_path),
    });
  }

  public toPersonSimple(json: any): PersonSimpleEntity {
    return new PersonSimpleEntity({
      id: json.id.toString(),
      name: json.name,
      profileImageUrls: this.toProfileImagePath(json.profile_path),
    });
  }

  public toPersonDetail(json: any): PersonDetailEntity {
    return new PersonDetailEntity({
      id: json.id.toString(),
      name: json.name,
      biography: json.biography,
      birthDateTimestamp: this.dateUtil.asTimestamp(json.birthday),
      placeOfBirth: json.place_of_birth,
      deathDateTimestamp: this.dateUtil.asTimestamp(json.deathday),
      profileImageUrls: this.toProfileImagePath(json.profile_path),
    });
  }

  public toCredit(json: any): CreditEntity {
    let role = '';
    if (json.hasOwnProperty('character')) {
      role = json.character;
    } else if (json.hasOwnProperty('job')) {
      role = json.job;
    }
    return new CreditEntity({
      id: json.id,
      name: json.name,
      role: role,
      profileImageUrls: this.toProfileImagePath(json.profile_path),
    });
  }

  public toPersonMovieCredit(json: any): PersonCreditEntity {
    let role = '';
    if (json.hasOwnProperty('character')) {
      role = json.character;
    } else if (json.hasOwnProperty('job')) {
      role = json.job;
    }

    return new PersonCreditEntity({
      role: role,
      detail: this.toMovieSimple(json),
    });
  }

  public toPersonTvShowCredit(json: any): PersonCreditEntity {
    let role = '';
    if (json.hasOwnProperty('character')) {
      role = json.character;
    } else if (json.hasOwnProperty('job')) {
      role = json.job;
    }

    return new PersonCreditEntity({
      role: role,
      detail: this.toTvShowSimple(json),
    });
  }

  public toEpisodeSimple(tvShowId: string, json: any): EpisodeSimpleEntity {
    return new EpisodeSimpleEntity({
      tvShowId: tvShowId,
      season: json.season_number,
      episode: json.episode_number,
      name: json.name,
      overview: json.overview,
      stillImageUrls: this.toStillImagePath(json.still_path),
    });
  }

  public toEpisodeDetail(tvShowId: string, json: any): EpisodeDetailEntity {
    return new EpisodeDetailEntity({
      tvShowId: tvShowId,
      season: json.season_number,
      episode: json.episode_number,
      name: json.name,
      overview: json.overview,
      stillImageUrls: this.toStillImagePath(json.still_path),
    });
  }

  public toSingleResponse<T extends Entity | Entity[]>(
    data: T,
    currentPage?: number,
    hasPrevious?: boolean,
    hasNext?: boolean,
  ): Result<T> {
    try {
      return new Result<T>({
        data: data,
        currentPage: currentPage || 1,
        hasPrevious: hasPrevious || false,
        hasNext: hasNext || false,
      });
    } catch (error) {
      return new Result<T>({
        throwable: new ContentFailedToLoadThrowable(error.toString()),
      });
    }
  }

  public toPagedResponse<T extends Entity>(
    response: TMDbApiPagedResponse<any>,
    data: T[],
  ): Result<T[]> {
    try {
      return new Result<T[]>({
        data: data,
        currentPage: response.page,
        hasPrevious: response.page > 1,
        hasNext: response.page < response.total_pages,
      });
    } catch (error) {
      return new Result<T[]>({
        throwable: new ContentFailedToLoadThrowable(error.toString()),
      });
    }
  }
}
