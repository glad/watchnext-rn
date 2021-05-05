import {EntityType} from '@watchnext-domain/entities';
import React from 'react';
import {ImageBackground, Pressable, StyleSheet, Text, View} from 'react-native';
import {Assets} from '../assets';

export interface SimpleContentCardComponentProps {
  index: number;
  id: string;
  type: EntityType;
  onPress: () => void;
  primaryTitle: string;
  secondaryTitle?: string;
  thumbnailUrl?: string;
  landscape?: boolean;
}

export const SimpleContentCardComponent = ({
  type,
  primaryTitle,
  secondaryTitle,
  thumbnailUrl,
  landscape,
  onPress,
}: SimpleContentCardComponentProps) => {
  return (
    <Pressable android_ripple={{color: Assets.Colors.RIPPLE}} onPress={onPress}>
      <View style={styles.container}>
        <View
          style={
            landscape === true
              ? styles.thumbnailLandscape
              : styles.thumbnailPortrait
          }>
          <ImageBackground
            style={styles.thumbnail}
            source={Assets.Images.PLACEHOLDER(type)}
            resizeMode="cover"
          />
          <ImageBackground
            style={[styles.thumbnail]}
            source={{uri: thumbnailUrl}}
            resizeMode="cover"
          />
          <View style={styles.thumbnail} />
        </View>
        <View style={styles.metadataContainer}>
          <Text
            style={styles.primaryTitle}
            numberOfLines={3}
            ellipsizeMode="tail">
            {primaryTitle}
          </Text>
          {secondaryTitle === undefined ? null : (
            <Text
              style={styles.secondaryTitle}
              numberOfLines={2}
              ellipsizeMode="tail">
              {secondaryTitle}
            </Text>
          )}
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderColor: Assets.Colors.THUMBNAIL_BORDER,
    borderWidth: Assets.Dimensions.Padding.ONE,
  },
  thumbnailPortrait: {
    aspectRatio: 2 / 3,
    height: Assets.Dimensions.ImageSize.THUMBNAIL_LARGE,
  },
  thumbnailLandscape: {
    aspectRatio: 16 / 9,
    height: Assets.Dimensions.ImageSize.THUMBNAIL_MEDIUM,
  },
  overlay: {
    flex: 1,
    textAlignVertical: 'center',
    textAlign: 'center',
  },
  metadataContainer: {
    flex: 1,
    padding: Assets.Dimensions.Padding.LARGE,
  },
  primaryTitle: {
    fontSize: Assets.Dimensions.FontSize.LARGE,
    color: Assets.Colors.TEXT_DEFAULT,
    fontWeight: 'bold',
  },
  secondaryTitle: {
    marginTop: Assets.Dimensions.Padding.NORMAL,
    fontSize: Assets.Dimensions.FontSize.NORMAL,
    color: Assets.Colors.TEXT_DEFAULT,
  },
  tertiaryTitle: {
    marginTop: Assets.Dimensions.Padding.NORMAL,
    fontSize: Assets.Dimensions.FontSize.NORMAL,
  },
  thumbnail: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});
