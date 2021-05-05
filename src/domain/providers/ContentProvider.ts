import {
  CreditEntity,
  EpisodeDetailEntity,
  EpisodeSimpleEntity,
  MovieDetailEntity,
  MovieSimpleEntity,
  PersonCreditEntity,
  PersonDetailEntity,
  PersonSimpleEntity,
  TvShowDetailEntity,
  TvShowSimpleEntity,
} from '../entities';
import {Result} from '../misc';

export interface ContentProvider {
  init(): Promise<boolean>;

  fetchFavoriteMovies(page: number): Promise<Result<MovieDetailEntity[]>>;
  fetchPopularMovies(page: number): Promise<Result<MovieSimpleEntity[]>>;
  fetchTopRatedMovies(page: number): Promise<Result<MovieSimpleEntity[]>>;
  fetchUpcomingMovies(page: number): Promise<Result<MovieSimpleEntity[]>>;
  fetchNowPlayingMovies(page: number): Promise<Result<MovieSimpleEntity[]>>;
  fetchSimilarMovies(
    id: string,
    page: number,
  ): Promise<Result<MovieSimpleEntity[]>>;
  fetchRecommendedMovies(
    id: string,
    page: number,
  ): Promise<Result<MovieSimpleEntity[]>>;
  fetchMovieCredits(id: string): Promise<Result<CreditEntity[]>>;
  fetchMovieDetail(id: string): Promise<Result<MovieDetailEntity>>;
  searchMovies(
    query: string,
    page: number,
  ): Promise<Result<MovieSimpleEntity[]>>;

  fetchFavoriteTvShows(page: number): Promise<Result<TvShowDetailEntity[]>>;
  fetchPopularTvShows(page: number): Promise<Result<TvShowSimpleEntity[]>>;
  fetchTopRatedTvShows(page: number): Promise<Result<TvShowSimpleEntity[]>>;
  fetchOnTheAirTvShows(page: number): Promise<Result<TvShowSimpleEntity[]>>;
  fetchAiringTodayTvShows(page: number): Promise<Result<TvShowSimpleEntity[]>>;
  fetchSimilarTvShows(
    id: string,
    page: number,
  ): Promise<Result<TvShowSimpleEntity[]>>;
  fetchRecommendedTvShows(
    id: string,
    page: number,
  ): Promise<Result<TvShowSimpleEntity[]>>;
  fetchTvShowCredits(id: string): Promise<Result<CreditEntity[]>>;
  fetchTvShowDetail(id: string): Promise<Result<TvShowDetailEntity>>;
  searchTvShows(
    query: string,
    page: number,
  ): Promise<Result<TvShowSimpleEntity[]>>;
  fetchTvShowEpisodes(
    tvShowId: string,
    season: number,
    maxSeasons: number,
  ): Promise<Result<EpisodeSimpleEntity[]>>;
  fetchTvShowEpisodeDetail(
    tvShowId: string,
    season: number,
    episode: number,
  ): Promise<Result<EpisodeDetailEntity>>;

  fetchFavoritePeople(page: number): Promise<Result<PersonDetailEntity[]>>;
  fetchPopularPeople(page: number): Promise<Result<PersonSimpleEntity[]>>;
  fetchPersonDetail(id: string): Promise<Result<PersonDetailEntity>>;
  fetchPersonMovieCredits(id: string): Promise<Result<PersonCreditEntity[]>>;
  fetchPersonTvShowCredits(id: string): Promise<Result<PersonCreditEntity[]>>;
  searchPerson(
    query: string,
    page: number,
  ): Promise<Result<PersonSimpleEntity[]>>;
}
