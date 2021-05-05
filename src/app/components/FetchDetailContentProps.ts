export interface FetchDetailContentProps {}

export class FetchMovieDetailContentProps implements FetchDetailContentProps {
  public readonly movieId: string;

  constructor(id: string) {
    this.movieId = id;
  }
}

export class FetchTvShowDetailContentProps implements FetchDetailContentProps {
  public readonly tvShowId: string;

  constructor(id: string) {
    this.tvShowId = id;
  }
}

export class FetchPersonDetailContentProps implements FetchDetailContentProps {
  public readonly personId: string;

  constructor(id: string) {
    this.personId = id;
  }
}

export class FetchCreditsDetailContentProps implements FetchDetailContentProps {
  public readonly id: string;

  constructor(id: string) {
    this.id = id;
  }
}

export class FetchTvShowEpisodeDetailContentProps
  implements FetchDetailContentProps {
  public readonly tvShowId: string;
  public readonly season: number;
  public readonly episode: number;

  constructor(tvShowId: string, season: number, episode: number) {
    this.tvShowId = tvShowId;
    this.season = season;
    this.episode = episode;
  }
}
