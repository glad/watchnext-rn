import React from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import {Assets} from '../assets';

export interface EmptyContentComponentProps {
  message: string;
}

export const EmptyContentComponent = React.memo(
  ({message}: EmptyContentComponentProps) => {
    return (
      <View style={styles.container}>
        <View style={styles.content}>
          <Image
            source={Assets.Images.ERROR_ILLUSTRATION}
            style={{width: 50, height: 50}}
          />
          <Text style={styles.title}>{Assets.Strings.ERROR_TITLE}</Text>
          <Text style={styles.message} numberOfLines={3} ellipsizeMode="tail">
            {message}
          </Text>
        </View>
      </View>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginTop: Assets.Dimensions.Padding.LARGE,
  },

  content: {
    width: '75%',
    alignItems: 'center',
    justifyContent: 'center',
  },

  title: {
    textAlign: 'center',
    color: Assets.Colors.TEXT_DEFAULT,
    fontSize: Assets.Dimensions.FontSize.XLARGE,
    fontWeight: 'bold',
    marginTop: Assets.Dimensions.Padding.NORMAL,
  },

  message: {
    textAlign: 'center',
    color: Assets.Colors.TEXT_DEFAULT,
    fontSize: Assets.Dimensions.FontSize.LARGE,
    marginTop: Assets.Dimensions.Padding.NORMAL,
  },
});
