import {EntityType} from '@watchnext-domain/entities';
import React from 'react';
import {ImageBackground, Pressable, StyleSheet, Text, View} from 'react-native';
import {Assets} from '../assets';

export interface ThumbnailContentComponentProps {
  index: number;
  id: string;
  type: EntityType;
  onPress: () => void;
  thumbnailUrl?: string;
  placeholderText?: string;
}

export const ThumbnailContentComponent = ({
  type,
  thumbnailUrl,
  placeholderText,
  onPress,
}: ThumbnailContentComponentProps) => {
  return (
    <View style={styles.thumbnailContainer}>
      <ImageBackground
        style={styles.thumbnail}
        source={Assets.Images.PLACEHOLDER(type)}
        resizeMode="cover"
      />
      <Text
        style={[styles.overlay, styles.placeholderText]}
        numberOfLines={6}
        ellipsizeMode="tail">
        {placeholderText}
      </Text>
      <ImageBackground
        style={[styles.thumbnail, {opacity: 1}]}
        source={{uri: thumbnailUrl}}
        resizeMode="cover"
      />
      <Pressable
        android_ripple={{color: Assets.Colors.RIPPLE}}
        style={styles.thumbnail}
        onPress={onPress}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  thumbnailContainer: {
    flex: 1 / Assets.Numbers.THUMBNAILS_PER_ROW,
    aspectRatio: 2 / 3,
    borderColor: Assets.Colors.THUMBNAIL_BORDER,
    borderWidth: Assets.Dimensions.Padding.ONE,
  },
  overlay: {
    flex: 1,
    textAlignVertical: 'center',
    textAlign: 'center',
  },
  placeholderText: {
    padding: Assets.Dimensions.Padding.LARGE,
    fontSize: Assets.Dimensions.FontSize.LARGE,
    color: Assets.Colors.TEXT_DEFAULT,
  },
  thumbnail: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});
