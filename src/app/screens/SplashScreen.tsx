import React from 'react';
import {ActivityIndicator, Image, StyleSheet, View} from 'react-native';
import {Assets} from '../assets';
import {AppWindowComponent} from '../components';
import {useAppContext, useDependencyContext} from '../contexts';
import {useAppNavigation} from '../hooks';

const APP_START_TIME = Date.now();

export const SplashScreen = () => {
  const {setAppSettings} = useAppContext();
  const {startupInit, settingsProvider, logger} = useDependencyContext();
  const {
    navigateToTest,
    navigateToHome,
    navigateToMovieDetail,
    navigateToPersonDetail,
  } = useAppNavigation();

  React.useEffect(() => {
    (async () => {
      await startupInit().then((_) =>
        setAppSettings(settingsProvider.getSettings()),
      );

      const sleepTime = Math.max(0, 500 - (Date.now() - APP_START_TIME));
      logger.i(`Sleeping for ${sleepTime}`);

      setTimeout(() => {
        navigateToHome();
        // navigateToTest()
        // navigateToTvShowDetail('1399')
        // navigateToMovieDetail('321')
        // navigateToPersonDetail('2')
      }, sleepTime);
    })();
  }, []);

  return (
    <AppWindowComponent>
      <View style={styles.container}>
        <Image source={Assets.Images.APP_SPLASH_LOGO} style={styles.logo} />
      </View>
      <ActivityIndicator
        style={styles.indicator}
        color={Assets.Colors.ACCENT}
        animating={true}
      />
    </AppWindowComponent>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Assets.Colors.WINDOW_BACKGROUND,
  },
  logo: {
    width: Assets.Dimensions.ImageSize.ILLUSTRATION,
    height: Assets.Dimensions.ImageSize.ILLUSTRATION,
    marginTop: Assets.Dimensions.Padding.XLARGE,
  },
  indicator: {
    marginBottom: Assets.Dimensions.Padding.XLARGE,
  },
});
