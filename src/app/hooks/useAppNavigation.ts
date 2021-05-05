import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

export const useAppNavigation = () => {
  const navigation = useNavigation<StackNavigationProp<any>>();

  const navigateToTest = () => navigation.push('TestScreen');
  const navigateToDebug = () => navigation.push('DebugScreen');

  const navigateToHome = () => navigation.replace('HomeScreen');

  const navigateToMovieDetail = (id: string) =>
    navigation.push('MovieDetailScreen', {movieId: id});
  const navigateToTvShowDetail = (id: string) =>
    navigation.push('TvShowDetailScreen', {tvShowId: id});
  const navigateToTvShowEpisodeDetail = (
    tvShowId: string,
    season: number,
    episode: number,
  ) =>
    navigation.push('TvShowEpisodeDetailScreen', {
      tvShowId: tvShowId,
      season: season,
      episode: episode,
    });
  const navigateToPersonDetail = (id: string) =>
    navigation.push('PersonDetailScreen', {personId: id});

  return {
    navigateToTest,
    navigateToDebug,

    navigateToHome,

    navigateToMovieDetail,
    navigateToTvShowDetail,
    navigateToTvShowEpisodeDetail,
    navigateToPersonDetail,
  };
};
