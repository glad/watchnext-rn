import {TMDB_API_BASE_URL, TMDB_API_V3_TOKEN} from '@env';
import {
  CreditEntity,
  Entity,
  MovieDetailEntity,
  MovieSimpleEntity,
  PersonCreditEntity,
  PersonDetailEntity,
  PersonSimpleEntity,
  TvShowDetailEntity,
  TvShowSimpleEntity,
} from '@watchnext-domain/entities';
import {Result} from '@watchnext-domain/misc';
import {ContentProvider} from '@watchnext-domain/providers';
import {CacheService, FavoriteContentService} from '@watchnext-domain/services';
import {
  BaseThrowable,
  ContentFailedToLoadThrowable,
  EmptyCollectionThrowable,
  EmptyFavoritesThrowable,
  EmptySearchResultsThrowable,
  GenericErrorThrowable,
} from '@watchnext-domain/throwables';
import {DateUtil, Logger} from '@watchnext-domain/utils';
import {EpisodeDetailEntity} from './../../../domain/entities/content/episode/EpisodeDetailEntity';
import {EpisodeSimpleEntity} from './../../../domain/entities/content/episode/EpisodeSimpleEntity';
import {TMDbJsonToEntityMapper} from './TMDbJsonToEntityMapper';

/**
 * Provides content fetched from TMDB
 */
export class TMDbContentProvider implements ContentProvider {
  private static FAVORITE_CONTENT_PER_PAGE = 10;
  private static CACHE_KEY = {
    MOVIE_SIMPLE: ['id', 'title', 'overview', 'poster_path', 'backdrop_path'],
    MOVIE_DETAIL: [
      'id',
      'title',
      'overview',
      'poster_path',
      'backdrop_path',
      'release_date',
      'runtime',
      'production_countries',
      'genres',
    ],
    TVSHOW_SIMPLE: ['id', 'name', 'overview', 'poster_path', 'backdrop_path'],
    TVSHOW_DETAIL: [
      'id',
      'name',
      'overview',
      'poster_path',
      'backdrop_path',
      'first_air_date',
      'number_of_seasons',
      'production_countries',
      'genres',
    ],
    PERSON_SIMPLE: ['id', 'name', 'profile_path'],
    PERSON_DETAIL: [
      'id',
      'name',
      'profile_path',
      'biography',
      'birthday',
      'place_of_birth',
      'deathday',
    ],
    PERSON_CREDIT: [
      'character',
      'id',
      'title',
      'name',
      'overview',
      'release_date',
      'first_air_date',
      'poster_path',
      'backdrop_path',
    ],
    CREDIT: ['id', 'name', 'character', 'department', 'profile_path'],
    EPISODE_SIMPLE: [
      'id',
      'name',
      'overview',
      'season_number',
      'episode_number',
      'still_path',
    ],
    EPISODE_DETAIL: [
      'id',
      'name',
      'overview',
      'season_number',
      'episode_number',
      'still_path',
    ],
  };

  private initialized: boolean = false;
  private logger: Logger;
  private entityMapper: TMDbJsonToEntityMapper;
  private cacheService: CacheService;
  private favoriteService: FavoriteContentService;
  private signalMap = new Map<string, AbortController>();

  constructor(
    logger: Logger,
    cacheService: CacheService,
    favoriteService: FavoriteContentService,
    dateUtil: DateUtil,
  ) {
    this.logger = logger;
    this.entityMapper = new TMDbJsonToEntityMapper(dateUtil);
    this.cacheService = cacheService;
    this.favoriteService = favoriteService;
  }

  private resetAbortController(url: string) {
    const existingController = this.signalMap.get(url);

    if (existingController !== undefined) {
      this.signalMap.delete(url);
    }
  }

  private getAbortController(url: string): AbortController {
    const existingController = this.signalMap.get(url);

    if (existingController !== undefined) {
      this.logger.w(`Aborting(${existingController.signal.aborted}) ${url}`);
      existingController.abort();
    }

    const newController = new AbortController();
    this.signalMap.set(url, newController);

    return newController;
  }

  private getRequestUrl(
    path: string,
    page?: number,
    queryParams?: [string, any][],
  ): URL {
    const url = new URL(path, TMDB_API_BASE_URL);
    if (page !== undefined) {
      url.searchParams.append('page', page.toString());
    }
    queryParams?.map((pair) => {
      url.searchParams.append(pair[0], pair[1]);
    });

    return url;
  }

  private getRequest(url: URL): Request {
    url.searchParams.append('api_key', TMDB_API_V3_TOKEN);

    const headers = new Headers();
    headers.append('Content-Type', 'application/json');

    return new Request(url.toString());
  }

  private async fetchCachedContent(cacheKey: string) {
    return await this.cacheService.get(cacheKey).then((text) => {
      try {
        if (text !== undefined) {
          const json = JSON.parse(text);
          this.logger.w(`fetchCachedContent: /cache --> ${cacheKey}`);
          return json;
        }
      } catch (error) {
        // No-op
      }

      return undefined;
    });
  }

  private async fetchRemoteContent(request: any) {
    const {signal} = this.getAbortController(request.url);

    return await await fetch(request, {signal})
      .then((res) => {
        this.logger.i(
          `fetchRemoteContent: /${request.method} ${res.status} --> ${request.url}`,
        );
        return res.json();
      })
      .catch((error) => {
        if (error.name === 'AbortError') {
          this.logger.w(`${request.url} aborted...`);
        }

        return {
          success: false,
          status_message: error.toString(),
        };
      })
      .then((json) => {
        this.resetAbortController(request.url);

        if (json.success === false) {
          throw new ContentFailedToLoadThrowable(json.status_message);
        }
        return json;
      });
  }

  private async fetchPagedContent<T extends Entity>(
    path: string,
    page: number,
    queryParams: [string, any][],
    mapper: (json: any) => T,
    cacheKeys?: string[],
  ): Promise<Result<T[]>> {
    const url = this.getRequestUrl(path, page, queryParams);
    const requestCacheKey = url.toString();
    const request = this.getRequest(url);

    const remoteFetch = async () => {
      const json = await this.fetchRemoteContent(request);

      if (cacheKeys === undefined) {
        return json;
      }

      const newResults: any[] = [];
      json.results.forEach((item: any) => {
        const newItem: any = {};

        cacheKeys.forEach((key) => {
          if (item.hasOwnProperty(key)) {
            newItem[key] = item[key];
          }
        });

        newResults.push(newItem);
      });

      const newJson = {...json, results: newResults};

      if (newResults.length > 0) {
        this.cacheService
          .put(requestCacheKey, JSON.stringify(newJson))
          .then((success) => {
            if (success) {
              this.logger.i(
                `fetchPagedContent: /cached --> ${requestCacheKey}`,
              );
            }
          });
      }

      return newJson;
    };

    // @ts-ignore ts(2322)
    return await this.fetchCachedContent(requestCacheKey)
      .then((json) => {
        if (json === undefined) {
          return remoteFetch();
        } else {
          return Promise.resolve(json);
        }
      })
      .then((json) => {
        const data = new Array<T>();
        json.results.forEach((item: any) => {
          data.push(mapper(item));
        });

        if (data && data.length === 0) {
          throw EmptyCollectionThrowable.INSTANCE;
        }

        return this.entityMapper.toPagedResponse(json, data);
      })
      .catch((error) => {
        if (error instanceof BaseThrowable) {
          return new Result<T>({throwable: error});
        } else if (error.hasOwnProperty('throwable')) {
          return new Result<T>({throwable: error.throwable});
        } else {
          return new Result<T>({
            throwable: new GenericErrorThrowable(JSON.stringify(error)),
          });
        }
      });
  }

  private async fetchFlatContent<T extends Entity>(
    path: string,
    mapper: (json: any) => T,
    cacheKeys?: string[],
  ): Promise<Result<T>> {
    const url = this.getRequestUrl(path);
    const requestCacheKey = url.toString();
    const request = this.getRequest(url);

    const remoteFetch = async () => {
      const json = await this.fetchRemoteContent(request);

      if (cacheKeys === undefined) {
        return json;
      }

      const newJson: any = {};
      cacheKeys.forEach((key) => {
        if (json.hasOwnProperty(key)) {
          newJson[key] = json[key];
        }
      });

      try {
        const content = mapper(newJson);
        this.cacheService.put(content.key, JSON.stringify(newJson));
      } catch (error) {
        //No-op
      }

      this.cacheService
        .put(requestCacheKey, JSON.stringify(newJson))
        .then((success) => {
          if (success) {
            this.logger.i(`fetchFlatContent: /cached --> ${requestCacheKey}`);
          }
          return success;
        });

      return newJson;
    };

    // @ts-ignore ts(2322)
    return await this.fetchCachedContent(requestCacheKey)
      .then((json) => {
        if (json === undefined) {
          return remoteFetch();
        } else {
          return Promise.resolve(json);
        }
      })
      .then((json) => mapper(json))
      .then((json) => this.entityMapper.toSingleResponse(json))
      .catch((error) => {
        if (error instanceof BaseThrowable) {
          return new Result<T>({throwable: error});
        } else if (error.hasOwnProperty('throwable')) {
          return new Result<T>({throwable: error.throwable});
        } else {
          return new Result<T>({
            throwable: new GenericErrorThrowable(JSON.stringify(error)),
          });
        }
      });
  }

  private async fetchListContent<T extends Entity>(
    path: string,
    flattenResponse: (json: any) => any,
    mapper: (json: any) => T,
    cacheKeys?: string[],
    pageMapper?: () => {
      currentPage: number;
      hasPrevious: boolean;
      hasNext: boolean;
    },
  ): Promise<Result<T[]>> {
    const url = this.getRequestUrl(path);
    const requestCacheKey = url.toString();
    const request = this.getRequest(url);

    const remoteFetch = async () => {
      const results = await this.fetchRemoteContent(request)
        .then((json) => flattenResponse(json))
        .then((results) => {
          if (Array.isArray(results) && results.length === 0) {
            throw EmptyCollectionThrowable.INSTANCE;
          }
          return results;
        });

      if (cacheKeys === undefined) {
        return results;
      }

      const newResults: any[] = [];
      results.forEach((item: any) => {
        const newItem: any = {};

        cacheKeys.forEach((key) => {
          if (item.hasOwnProperty(key)) {
            newItem[key] = item[key];
          }
        });

        newResults.push(newItem);
      });

      if (newResults.length > 0) {
        this.cacheService
          .put(requestCacheKey, JSON.stringify(newResults))
          .then((success) => {
            if (success) {
              this.logger.i(`fetchListContent: /cached --> ${requestCacheKey}`);
            }
            return success;
          });
      }

      return newResults;
    };

    // @ts-ignore ts(2322)
    return await this.fetchCachedContent(requestCacheKey)
      .then((results: any) => {
        if (results === undefined) {
          return remoteFetch();
        } else {
          return Promise.resolve(results);
        }
      })
      .then((results: Array<any>) => {
        const mappedResults = new Array<T>();
        results.forEach((item) => {
          try {
            mappedResults.push(mapper(item));
          } catch (error) {
            // No-op
          }
        });
        const pagination = (
          pageMapper ||
          (() => {
            return {
              currentPage: 1,
              hasPrevious: false,
              hasNext: false,
            };
          })
        )();
        return this.entityMapper.toSingleResponse(
          mappedResults,
          pagination.currentPage,
          pagination.hasPrevious,
          pagination.hasNext,
        );
      })
      .catch((error) => {
        if (error instanceof BaseThrowable) {
          return new Result<T>({throwable: error});
        } else if (error.hasOwnProperty('throwable')) {
          return new Result<T>({throwable: error.throwable});
        } else {
          return new Result<T>({
            throwable: new GenericErrorThrowable(JSON.stringify(error)),
          });
        }
      });
  }

  private async fetchConfiguration(): Promise<boolean> {
    const url = this.getRequestUrl('/configuration');
    const requestCacheKey = url.toString();
    const request = this.getRequest(url);

    const remoteFetch = async () => {
      return await this.fetchRemoteContent(request)
        .then((json) => {
          try {
            return this.cacheService
              .put(requestCacheKey, JSON.stringify(json))
              .then((success) => {
                if (success) {
                  this.logger.i(
                    `fetchConfiguration: /cached --> ${requestCacheKey}`,
                  );
                }
                return json;
              })
              .catch((error) => {
                this.logger.w(error);
                return json;
              });
          } catch (error) {
            throw error;
          }
        })
        .catch((error) => {
          this.logger.e(
            'fetchConfiguration: Failed to initialize',
            error.toString(),
          );
          return false;
        });
    };

    // @ts-ignore ts(2322)
    return await this.fetchCachedContent(requestCacheKey)
      .then((json) => {
        if (json === undefined) {
          return remoteFetch();
        } else {
          return Promise.resolve(json);
        }
      })
      .then((json) => this.entityMapper.setConfiguration(json))
      .catch((error) => {
        this.logger.e(
          'fetchConfiguration: Failed to initialize',
          error.toString(),
        );
        return false;
      });
  }

  private async fetchFavorites<T extends Entity>(
    page: number,
    classNameFilter: (className: string) => boolean,
    fetchContentCallback: (id: string) => Promise<Result<T>>,
  ) {
    const perPage = TMDbContentProvider.FAVORITE_CONTENT_PER_PAGE;
    const allKeys = this.favoriteService.favorites.filter((key) =>
      classNameFilter(key.className),
    );

    const startIndex = (page - 1) * perPage;
    const endIndex = Math.max(
      0,
      Math.min(allKeys.length - 1, startIndex + perPage - 1),
    );
    const hasNext = endIndex < allKeys.length - 1;
    const pagedKeys = allKeys.slice(startIndex, endIndex + 1);
    const promises = pagedKeys.map((key) => fetchContentCallback(key.id));

    return await Promise.all(promises)
      .then((results) =>
        results.filter((result) => result.throwable === undefined),
      )
      .then((results: Result<T>[]) => {
        const data = Array<T>();

        results.forEach((result) => {
          try {
            data.push(result.data!!);
          } catch (error) {
            // No-op
          }
        });

        if (data.length === 0) {
          throw EmptyFavoritesThrowable.INSTANCE;
        }

        return new Result<T[]>({
          data: data,
          currentPage: page,
          hasPrevious: page > 1,
          hasNext: hasNext,
        });
      })
      .catch((error) => {
        if (error instanceof BaseThrowable) {
          return new Result<T[]>({throwable: error});
        } else if (error.hasOwnProperty('throwable')) {
          return new Result<T[]>({throwable: error.throwable});
        } else {
          return new Result<T[]>({
            throwable: new GenericErrorThrowable(JSON.stringify(error)),
          });
        }
      });
  }

  public async init(): Promise<boolean> {
    if (this.initialized) {
      return Promise.resolve(true);
    }
    this.initialized = true;
    this.logger.i(`TMDbContentProvider.init() called`);

    // await this.cacheService.clear()

    return await this.fetchConfiguration();
  }

  public async fetchFavoriteMovies(
    page: number,
  ): Promise<Result<MovieDetailEntity[]>> {
    return await this.fetchFavorites<MovieDetailEntity>(
      page,
      (className) => className === MovieDetailEntity.ClassName,
      (id) => this.fetchMovieDetail(id),
    );
  }

  public async fetchPopularMovies(
    page: number,
  ): Promise<Result<MovieSimpleEntity[]>> {
    return await this.fetchPagedContent<MovieSimpleEntity>(
      `/movie/popular`,
      page,
      [],
      (json) => this.entityMapper.toMovieSimple(json),
      TMDbContentProvider.CACHE_KEY.MOVIE_SIMPLE,
    );
  }

  public async fetchTopRatedMovies(
    page: number,
  ): Promise<Result<MovieSimpleEntity[]>> {
    return await this.fetchPagedContent<MovieSimpleEntity>(
      `/movie/top_rated`,
      page,
      [],
      (json) => this.entityMapper.toMovieSimple(json),
      TMDbContentProvider.CACHE_KEY.MOVIE_SIMPLE,
    );
  }

  public async fetchUpcomingMovies(
    page: number,
  ): Promise<Result<MovieSimpleEntity[]>> {
    return await this.fetchPagedContent<MovieSimpleEntity>(
      `/movie/upcoming`,
      page,
      [],
      (json) => this.entityMapper.toMovieSimple(json),
      TMDbContentProvider.CACHE_KEY.MOVIE_SIMPLE,
    );
  }

  public async fetchNowPlayingMovies(
    page: number,
  ): Promise<Result<MovieSimpleEntity[]>> {
    return await this.fetchPagedContent<MovieSimpleEntity>(
      `/movie/now_playing`,
      page,
      [],
      (json) => this.entityMapper.toMovieSimple(json),
      TMDbContentProvider.CACHE_KEY.MOVIE_SIMPLE,
    );
  }

  public async fetchSimilarMovies(
    id: string,
    page: number,
  ): Promise<Result<MovieSimpleEntity[]>> {
    return await this.fetchPagedContent<MovieSimpleEntity>(
      `/movie/${id}/similar`,
      page,
      [],
      (json) => this.entityMapper.toMovieSimple(json),
      TMDbContentProvider.CACHE_KEY.MOVIE_SIMPLE,
    );
  }

  public async fetchRecommendedMovies(
    id: string,
    page: number,
  ): Promise<Result<MovieSimpleEntity[]>> {
    return await this.fetchPagedContent<MovieSimpleEntity>(
      `/movie/${id}/recommendations`,
      page,
      [],
      (json) => this.entityMapper.toMovieSimple(json),
      TMDbContentProvider.CACHE_KEY.MOVIE_SIMPLE,
    );
  }

  public async fetchMovieCredits(id: string): Promise<Result<CreditEntity[]>> {
    return await this.fetchListContent<CreditEntity>(
      `/movie/${id}/credits`,
      (json) => [...json.cast, ...json.crew],
      (json) => this.entityMapper.toCredit(json),
      TMDbContentProvider.CACHE_KEY.CREDIT,
    );
  }

  public async fetchMovieDetail(
    id: string,
  ): Promise<Result<MovieDetailEntity>> {
    return await this.fetchFlatContent<MovieDetailEntity>(
      `/movie/${id}`,
      (json) => this.entityMapper.toMovieDetail(json),
      TMDbContentProvider.CACHE_KEY.MOVIE_DETAIL,
    );
  }

  public async searchMovies(
    query: string,
    page: number,
  ): Promise<Result<MovieSimpleEntity[]>> {
    const result = await this.fetchPagedContent<MovieSimpleEntity>(
      `/search/movie`,
      page,
      [['query', query]],
      (json) => this.entityMapper.toMovieSimple(json),
    );

    if (result.throwable !== undefined) {
      return new Result<MovieSimpleEntity[]>({
        throwable: EmptySearchResultsThrowable.INSTANCE,
      });
    } else {
      return result;
    }
  }

  public async fetchFavoriteTvShows(
    page: number,
  ): Promise<Result<TvShowDetailEntity[]>> {
    return await this.fetchFavorites<TvShowDetailEntity>(
      page,
      (className) => className === TvShowDetailEntity.ClassName,
      (id) => this.fetchTvShowDetail(id),
    );
  }

  public async fetchPopularTvShows(
    page: number,
  ): Promise<Result<TvShowSimpleEntity[]>> {
    return await this.fetchPagedContent<TvShowSimpleEntity>(
      `/tv/popular`,
      page,
      [],
      (json) => this.entityMapper.toTvShowSimple(json),
      TMDbContentProvider.CACHE_KEY.TVSHOW_SIMPLE,
    );
  }

  public async fetchTopRatedTvShows(
    page: number,
  ): Promise<Result<TvShowSimpleEntity[]>> {
    return await this.fetchPagedContent<TvShowSimpleEntity>(
      `/tv/top_rated`,
      page,
      [],
      (json) => this.entityMapper.toTvShowSimple(json),
      TMDbContentProvider.CACHE_KEY.TVSHOW_SIMPLE,
    );
  }

  public async fetchOnTheAirTvShows(
    page: number,
  ): Promise<Result<TvShowSimpleEntity[]>> {
    return await this.fetchPagedContent<TvShowSimpleEntity>(
      `/tv/on_the_air`,
      page,
      [],
      (json) => this.entityMapper.toTvShowSimple(json),
      TMDbContentProvider.CACHE_KEY.TVSHOW_SIMPLE,
    );
  }

  public async fetchAiringTodayTvShows(
    page: number,
  ): Promise<Result<TvShowSimpleEntity[]>> {
    return await this.fetchPagedContent<TvShowSimpleEntity>(
      `/tv/airing_today`,
      page,
      [],
      (json) => this.entityMapper.toTvShowSimple(json),
      TMDbContentProvider.CACHE_KEY.TVSHOW_SIMPLE,
    );
  }

  public async fetchSimilarTvShows(
    id: string,
    page: number,
  ): Promise<Result<TvShowSimpleEntity[]>> {
    return await this.fetchPagedContent<TvShowSimpleEntity>(
      `/tv/${id}/similar`,
      page,
      [],
      (json) => this.entityMapper.toTvShowSimple(json),
      TMDbContentProvider.CACHE_KEY.TVSHOW_SIMPLE,
    );
  }

  public async fetchRecommendedTvShows(
    id: string,
    page: number,
  ): Promise<Result<TvShowSimpleEntity[]>> {
    return await this.fetchPagedContent<TvShowSimpleEntity>(
      `/tv/${id}/recommendations`,
      page,
      [],
      (json) => this.entityMapper.toTvShowSimple(json),
      TMDbContentProvider.CACHE_KEY.TVSHOW_SIMPLE,
    );
  }

  public async fetchTvShowCredits(id: string): Promise<Result<CreditEntity[]>> {
    return await this.fetchListContent<CreditEntity>(
      `/tv/${id}/credits`,
      (json) => [...json.cast, ...json.crew],
      (json) => this.entityMapper.toCredit(json),
      TMDbContentProvider.CACHE_KEY.CREDIT,
    );
  }

  public async fetchTvShowDetail(
    id: string,
  ): Promise<Result<TvShowDetailEntity>> {
    return await this.fetchFlatContent<TvShowDetailEntity>(
      `/tv/${id}`,
      (json) => this.entityMapper.toTvShowDetail(json),
      TMDbContentProvider.CACHE_KEY.TVSHOW_DETAIL,
    );
  }

  public async searchTvShows(
    query: string,
    page: number,
  ): Promise<Result<TvShowSimpleEntity[]>> {
    const result = await this.fetchPagedContent<TvShowSimpleEntity>(
      `/search/tv`,
      page,
      [[`query`, query]],
      (json) => this.entityMapper.toTvShowSimple(json),
    );

    if (result.throwable !== undefined) {
      return new Result<TvShowSimpleEntity[]>({
        throwable: EmptySearchResultsThrowable.INSTANCE,
      });
    } else {
      return result;
    }
  }

  public async fetchFavoritePeople(
    page: number,
  ): Promise<Result<PersonDetailEntity[]>> {
    return await this.fetchFavorites<PersonDetailEntity>(
      page,
      (className) => className === PersonDetailEntity.ClassName,
      (id) => this.fetchPersonDetail(id),
    );
  }

  public async fetchPopularPeople(
    page: number,
  ): Promise<Result<PersonSimpleEntity[]>> {
    return await this.fetchPagedContent<PersonSimpleEntity>(
      `/person/popular`,
      page,
      [],
      (json) => this.entityMapper.toPersonSimple(json),
      TMDbContentProvider.CACHE_KEY.PERSON_SIMPLE,
    );
  }
  public async fetchPersonMovieCredits(
    id: string,
  ): Promise<Result<PersonCreditEntity[]>> {
    return await this.fetchListContent<PersonCreditEntity>(
      `/person/${id}/movie_credits`,
      (json) => [...json.cast, ...json.crew],
      (json) => this.entityMapper.toPersonMovieCredit(json),
      TMDbContentProvider.CACHE_KEY.PERSON_CREDIT,
    );
  }

  public async fetchPersonTvShowCredits(
    id: string,
  ): Promise<Result<PersonCreditEntity[]>> {
    return await this.fetchListContent<PersonCreditEntity>(
      `/person/${id}/tv_credits`,
      (json) => [...json.cast, ...json.crew],
      (json) => this.entityMapper.toPersonTvShowCredit(json),
      TMDbContentProvider.CACHE_KEY.PERSON_CREDIT,
    );
  }

  public async fetchPersonDetail(
    id: string,
  ): Promise<Result<PersonDetailEntity>> {
    return await this.fetchFlatContent<PersonDetailEntity>(
      `/person/${id}`,
      (json) => this.entityMapper.toPersonDetail(json),
      TMDbContentProvider.CACHE_KEY.PERSON_DETAIL,
    );
  }

  public async searchPerson(
    query: string,
    page: number,
  ): Promise<Result<PersonSimpleEntity[]>> {
    const results = await this.fetchPagedContent<PersonSimpleEntity>(
      `/search/person`,
      page,
      [['query', query]],
      (json) => this.entityMapper.toPersonSimple(json),
    );

    if (results.throwable !== undefined) {
      return new Result<PersonSimpleEntity[]>({
        throwable: EmptySearchResultsThrowable.INSTANCE,
      });
    } else {
      return results;
    }
  }

  public async fetchTvShowEpisodes(
    tvShowId: string,
    season: number,
    maxSeasons: number,
  ): Promise<Result<EpisodeSimpleEntity[]>> {
    return await this.fetchListContent<EpisodeSimpleEntity>(
      `/tv/${tvShowId}/season/${season}`,
      (json) => [...json.episodes],
      (json) => this.entityMapper.toEpisodeSimple(tvShowId, json),
      TMDbContentProvider.CACHE_KEY.EPISODE_SIMPLE,
      () => {
        return {
          hasNext: season < maxSeasons,
          hasPrevious: season > 1,
          currentPage: season,
        };
      },
    );
  }

  public async fetchTvShowEpisodeDetail(
    tvShowId: string,
    season: number,
    episode: number,
  ): Promise<Result<EpisodeDetailEntity>> {
    return await this.fetchFlatContent<EpisodeDetailEntity>(
      `/tv/${tvShowId}/season/${season}/episode/${episode}`,
      (json) => this.entityMapper.toEpisodeDetail(tvShowId, json),
      TMDbContentProvider.CACHE_KEY.EPISODE_DETAIL,
    );
  }
}
