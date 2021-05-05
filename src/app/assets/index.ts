import {
  CreditEntity,
  Entity,
  EntityType,
  EpisodeDetailEntity,
  EpisodeSimpleEntity,
  MovieDetailEntity,
  MovieSimpleEntity,
  PersonDetailEntity,
  PersonSimpleEntity,
  TvShowDetailEntity,
  TvShowSimpleEntity,
} from '@watchnext-domain/entities';
import {
  ContentFailedToLoadThrowable,
  ContentNotAvailableThrowable,
  EmptyCollectionThrowable,
  EmptySearchHistoryThrowable,
  EmptySearchResultsThrowable,
} from '@watchnext-domain/throwables';
import {EmptyFavoritesThrowable} from './../../domain/throwables/EmptyFavoritesThrowable';

export const Assets = {
  Icons: {
    NETWORK_STATE_CONNECTED: require('./icons/network_state_connected.png'),
    NETWORK_STATE_DISCONNECTED: require('./icons/network_state_disconnected.png'),
    NAVIGATE_TO_DETAIL_SCREEN: require('./icons/navigate_to_detail_screen.png'),
    HEART_OUTLINE: require('./icons/heart_outline.png'),
    HEART_SOLID: require('./icons/heart_solid.png'),
    DELETE: require('./icons/delete.png'),
    SHARE: require('./icons/share.png'),
  },

  Images: {
    APP_SPLASH_LOGO: require('./images/app_splash_logo.png'),
    ERROR_ILLUSTRATION: require('./images/error_illustration.png'),
    TMDB_LOGO: require('./images/tmdb_logo.png'),
    PLACEHOLDER: (type: EntityType) => {
      switch (type) {
        case EntityType.MOVIE:
          return require('./images/placeholder_movie.png');
        case EntityType.TVSHOW:
          return require('./images/placeholder_tvshow.png');
        case EntityType.TVSHOW_EPISODE:
          return require('./images/placeholder_tvshow.png');
        case EntityType.PERSON:
          return require('./images/placeholder_person.png');
        default:
          return require('./images/placeholder_image.png');
      }
    },
  },

  Colors: {
    WINDOW_BACKGROUND: '#181818',
    MODAL_BACKGROUND: '#222',
    WINDOW_BACKGROUND_INVERSE: '#eceff1',

    THUMBNAIL_BORDER: '#242222',

    PRIMARY: '#f82818',
    PRIMARY_DARK: '#b01d10',
    ACCENT: '#ff5131',
    RIPPLE: 'rgba(255,255,255,0.15)',

    TAB_BACKGROUND: '#181111',
    TAB_INDICATOR: '#ff5131',

    ICON_DEFAULT: '#cfd8dc',
    ICON_INACTIVE: '#bdbdbd',
    ICON_ACTIVE: '#ff5131',

    BUTTON_INACTIVE: '#bdbdbd',
    BUTTON_ACTIVE: '#ff5131',

    TEXT_DEFAULT: '#cfd8dc',
    TEXT_DEFAULT_INVERSE: '#302723',

    TEXT_TITLE: '#cfd8dc',
    TEXT_METADATA: '#e0e0e0',
    TEXT_BODY: '#bdbdbd',
    TEXT_HEADING: '#f0f0f0',

    NETWORK_STATE_RESTORED_BACKGROUND: '#1b5e20',
    NETWORK_STATE_DISCONNECTED_BACKGROUND: '#b71c1c',
  },

  Strings: {
    ERROR_TITLE: 'Oops...',
    SEARCH_HINT: 'Search for movies, tv shows, people ...',
    NETWORK_STATE_DISCONNECTED: 'Network connection has disconnected',
    NETWORK_STATE_RESTORED: 'Network connection has restored',
    EMPTY_CONTENT_ERROR_MESSAGE: 'Failed to load content to show',
    ERROR: (error: any) => {
      let throwable = error;
      if (error.hasOwnProperty('throwable')) {
        throwable = error.throwable;
      }

      if (throwable instanceof EmptyCollectionThrowable) {
        return 'Collection is empty';
      } else if (throwable instanceof EmptyFavoritesThrowable) {
        return 'Favorites is empty';
      } else if (throwable instanceof ContentFailedToLoadThrowable) {
        return 'Content failed to load';
      } else if (throwable instanceof ContentNotAvailableThrowable) {
        return 'Content not available';
      } else if (throwable instanceof EmptyCollectionThrowable) {
        return 'Collection failed to load';
      } else if (throwable instanceof EmptySearchResultsThrowable) {
        return 'There are no results that match your query';
      } else if (throwable instanceof EmptySearchHistoryThrowable) {
        return 'Your search history is empty';
      } else {
        return 'Unknown error has occurred';
      }
    },

    SHARE: (entity: Entity) => {
      const baseMessage = 'Please view this';
      const baseUrl = `https://www.themoviedb.org`;

      if (
        entity instanceof MovieSimpleEntity ||
        entity instanceof MovieDetailEntity
      ) {
        return `${baseMessage} movie: ${baseUrl}/movie/${entity.id}`;
      } else if (
        entity instanceof TvShowSimpleEntity ||
        entity instanceof TvShowDetailEntity
      ) {
        return `${baseMessage} movie: ${baseUrl}/tv/${entity.id}`;
      } else if (
        entity instanceof PersonSimpleEntity ||
        entity instanceof PersonDetailEntity ||
        entity instanceof CreditEntity
      ) {
        return `${baseMessage} person: ${baseUrl}/person/${entity.id}`;
      } else if (
        entity instanceof EpisodeSimpleEntity ||
        entity instanceof EpisodeDetailEntity
      ) {
        return `${baseMessage} tv show episode: ${baseUrl}/tv/${entity.tvShowId}/season/${entity.season}/episode/${entity.episode}`;
      }

      return undefined;
    },
  },

  Numbers: {
    THUMBNAILS_PER_ROW: 3,
    TOOLBAR_HEIGHT: 48,
  },

  Dimensions: {
    FontSize: {
      SMALL: 14,
      NORMAL: 16,
      LARGE: 18,
      XLARGE: 22,
      XXLARGE: 32,
      XXXLARGE: 48,
    },

    Padding: {
      ONE: 1,
      TINY: 2,
      SMALL: 4,
      NORMAL: 8,
      LARGE: 16,
      XLARGE: 24,
      XXLARGE: 32,
      XXXLARGE: 48,
    },

    ImageSize: {
      ICON_SMALL: 16,
      ICON_MEDIUM: 24,
      ICON_LARGE: 32,
      THUMBNAIL_SMALL: 48,
      THUMBNAIL_MEDIUM: 96,
      THUMBNAIL_LARGE: 128,
      ILLUSTRATION: 144,
      BACKDROP: 1920,
      BOTTOM_NAV: 24,
    },

    ImageQuality: {
      THUMBNAIL_LOW: 180,
      THUMBNAIL_NORMAL: 360,
      THUMBNAIL_HIGH: 720,
      BACKDROP_LOW: 480,
      BACKDROP_NORMAL: 960,
      BACKDROP_HIGH: 1920,
    },
  },
};
