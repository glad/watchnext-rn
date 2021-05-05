import {
  SettingsCacheDuration,
  SettingsCacheStrategy,
} from '@watchnext-domain/providers';
import React from 'react';
import {
  Image,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {Assets} from '../assets';
import {useAppContext} from '../contexts';
import {useAppNavigation} from '../hooks';
import {
  name as AppDisplayName,
  version as AppDisplayVersion,
} from './../../../package.json';

export const SettingsScreen = () => {
  const {appSettings, setAppSettings, clearCache} = useAppContext();
  const {navigateToDebug} = useAppNavigation();

  const onPressCacheStrategy = (option: SettingsCacheStrategy) => {
    setAppSettings({...appSettings, ...{cacheStrategy: option}});
  };

  const onPressCacheDuration = (option: SettingsCacheDuration) => {
    setAppSettings({...appSettings, ...{cacheDuration: option}});
  };

  const onPressClearCache = () => clearCache();

  const onPressOpenTMDB = () => {
    (async () => {
      const url = 'https://www.themoviedb.org/';
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      }
    })();
  };

  const debugScreenClicks = React.useRef(0);
  const onPressAbout = () => {
    if (++debugScreenClicks.current == 8) {
      navigateToDebug();
      debugScreenClicks.current = 0;
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.row}>
        <Text style={styles.rowHeader}>Cache duration</Text>
        <Text style={styles.rowDescription}>
          How long to keep cached content until it becomes stale
        </Text>
        <View style={styles.buttonGroup}>
          <Pressable
            style={styles.pressable}
            android_ripple={{color: Assets.Colors.RIPPLE}}
            onPress={() => onPressCacheDuration(SettingsCacheDuration.NEVER)}>
            <Text
              style={[
                styles.radio,
                appSettings.cacheDuration === SettingsCacheDuration.NEVER
                  ? styles.radioActive
                  : {},
              ]}>
              Never
            </Text>
          </Pressable>
          <Pressable
            style={styles.pressable}
            android_ripple={{color: Assets.Colors.RIPPLE}}
            onPress={() => onPressCacheDuration(SettingsCacheDuration.ONE_DAY)}>
            <Text
              style={[
                styles.radio,
                appSettings.cacheDuration === SettingsCacheDuration.ONE_DAY
                  ? styles.radioActive
                  : {},
              ]}>
              1-day
            </Text>
          </Pressable>
          <Pressable
            style={styles.pressable}
            android_ripple={{color: Assets.Colors.RIPPLE}}
            onPress={() =>
              onPressCacheDuration(SettingsCacheDuration.ONE_WEEK)
            }>
            <Text
              style={[
                styles.radio,
                appSettings.cacheDuration === SettingsCacheDuration.ONE_WEEK
                  ? styles.radioActive
                  : {},
              ]}>
              1-week
            </Text>
          </Pressable>
          <Pressable
            style={styles.pressable}
            android_ripple={{color: Assets.Colors.RIPPLE}}
            onPress={() => onPressCacheDuration(SettingsCacheDuration.FOREVER)}>
            <Text
              style={[
                styles.radio,
                appSettings.cacheDuration === SettingsCacheDuration.FOREVER
                  ? styles.radioActive
                  : {},
              ]}>
              Forever
            </Text>
          </Pressable>
        </View>
      </View>
      <View style={styles.rowDivider} />
      <View style={styles.row}>
        <Text style={styles.rowHeader}>Cache strategy</Text>
        <Text style={styles.rowDescription}>
          How much content to keep cached after it is fetched from the remote
          server. The higher the strategy, the larger the amount of disk space
          will be used.
        </Text>
        <View style={styles.buttonGroup}>
          <Pressable
            style={styles.pressable}
            android_ripple={{color: Assets.Colors.RIPPLE}}
            onPress={() => onPressCacheStrategy(SettingsCacheStrategy.LOW)}>
            <Text
              style={[
                styles.radio,
                appSettings.cacheStrategy === SettingsCacheStrategy.LOW
                  ? styles.radioActive
                  : {},
              ]}>
              Low
            </Text>
          </Pressable>
          <Pressable
            style={styles.pressable}
            android_ripple={{color: Assets.Colors.RIPPLE}}
            onPress={() => onPressCacheStrategy(SettingsCacheStrategy.NORMAL)}>
            <Text
              style={[
                styles.radio,
                appSettings.cacheStrategy === SettingsCacheStrategy.NORMAL
                  ? styles.radioActive
                  : {},
              ]}>
              Normal
            </Text>
          </Pressable>
          <Pressable
            style={styles.pressable}
            android_ripple={{color: Assets.Colors.RIPPLE}}
            onPress={() => onPressCacheStrategy(SettingsCacheStrategy.HIGH)}>
            <Text
              style={[
                styles.radio,
                appSettings.cacheStrategy === SettingsCacheStrategy.HIGH
                  ? styles.radioActive
                  : {},
              ]}>
              High
            </Text>
          </Pressable>
        </View>
      </View>
      <View style={styles.rowDivider} />
      <View style={styles.row}>
        <Text style={styles.rowHeader}>Clear cache</Text>
        <Text style={styles.rowDescription}>
          Remove all cached content currently stored on disk
        </Text>
        <View style={styles.buttonGroup}>
          <Pressable
            style={[styles.pressable, {flex: 0.5}]}
            android_ripple={{color: Assets.Colors.RIPPLE}}
            onPress={onPressClearCache}>
            <Text style={styles.button}>Clear</Text>
          </Pressable>
        </View>
      </View>
      <View style={styles.rowDivider} />
      <View style={styles.row}>
        <Text style={styles.rowHeader}>About</Text>

        <Pressable style={styles.pressable} onPress={onPressAbout}>
          <Text style={styles.rowDescription}>
            {AppDisplayName} version {AppDisplayVersion}
          </Text>
        </Pressable>

        <Text style={styles.rowDescription}>
          Proudly built using data from:
        </Text>
        <Pressable
          style={[styles.pressable]}
          android_ripple={{color: Assets.Colors.RIPPLE}}
          onPress={onPressOpenTMDB}>
          <Image
            style={styles.tmdbLogo}
            resizeMode="contain"
            source={Assets.Images.TMDB_LOGO}
          />
        </Pressable>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Assets.Colors.WINDOW_BACKGROUND,
  },
  rowDivider: {
    height: Assets.Dimensions.Padding.SMALL,
    backgroundColor: Assets.Colors.WINDOW_BACKGROUND_INVERSE,
    opacity: 0.1,
  },
  row: {
    paddingVertical: Assets.Dimensions.Padding.LARGE,
    justifyContent: 'flex-start',
    alignContent: 'flex-start',
    textAlign: 'center',
    height: 'auto',
    marginBottom: Assets.Dimensions.Padding.NORMAL,
  },
  rowHeader: {
    paddingStart: Assets.Dimensions.Padding.LARGE,
    fontSize: Assets.Dimensions.FontSize.LARGE,
    color: Assets.Colors.TEXT_DEFAULT,
  },
  rowDescription: {
    paddingTop: Assets.Dimensions.Padding.NORMAL,
    paddingHorizontal: Assets.Dimensions.Padding.LARGE,
    fontSize: Assets.Dimensions.FontSize.SMALL,
    color: Assets.Colors.TEXT_DEFAULT,
    opacity: 0.75,
  },
  buttonGroup: {
    paddingTop: Assets.Dimensions.Padding.NORMAL,
    paddingStart: Assets.Dimensions.Padding.LARGE,
    flexDirection: 'row',
  },
  button: {
    padding: Assets.Dimensions.Padding.NORMAL,
    textAlign: 'center',
    color: Assets.Colors.TEXT_DEFAULT_INVERSE,
    backgroundColor: Assets.Colors.TEXT_DEFAULT,
  },
  radio: {
    padding: Assets.Dimensions.Padding.NORMAL,
    textAlign: 'center',
    color: Assets.Colors.TEXT_DEFAULT_INVERSE,
    backgroundColor: Assets.Colors.TEXT_DEFAULT,
  },
  radioActive: {
    backgroundColor: Assets.Colors.ACCENT,
    color: Assets.Colors.TEXT_DEFAULT,
    opacity: 1,
  },
  tmdbLogo: {
    marginStart: Assets.Dimensions.Padding.LARGE,
    width: '50%',
  },
  pressable: {
    flex: 1,
    justifyContent: 'space-evenly',
    marginEnd: Assets.Dimensions.Padding.NORMAL,
  },
});
