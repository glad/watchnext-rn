import {Entity, EntityType} from '@watchnext-domain/entities';
import React from 'react';
import {Image, ScrollView, StyleSheet, Text, View} from 'react-native';
import {Assets} from '../assets';
import {DetailOverviewActionIconsComponent} from './DetailOverviewActionIconsComponent';
import {DetailOverviewBackdropComponent} from './DetailOverviewBackdropComponent';
import {DetailOverviewComponentExtraProps} from './DetailOverviewComponent';
import {OnActionProps} from './OnActionProps';

export interface TvShowDetailOverviewComponentProps
  extends DetailOverviewComponentExtraProps {
  index: number;
  id: string;
  entity: Entity;
  onAction?: OnActionProps;
  name: string;
  overview: string;
  thumbnailUrl?: string;
  backdropUrl?: string;
  metadata: string[];
}

export const TvShowDetailOverviewComponent = ({
  entity,
  id,
  name,
  overview,
  thumbnailUrl,
  backdropUrl,
  metadata,
  onAction,
  showBackdrop,
  showOpenToDetailAction,
  showFavoriteAction,
  showShareAction,
}: TvShowDetailOverviewComponentProps) => {
  return (
    <ScrollView style={styles.container} key={id}>
      <DetailOverviewBackdropComponent
        id={id}
        key={id}
        backdropUrl={showBackdrop ? backdropUrl : undefined}>
        <View style={styles.contentContainer}>
          <View style={styles.card}>
            <Image
              style={styles.thumbnail}
              source={{uri: thumbnailUrl}}
              defaultSource={Assets.Images.PLACEHOLDER(EntityType.TVSHOW)}
              resizeMode="contain"
            />
            <View style={styles.descriptionContainer}>
              <Text style={styles.name} numberOfLines={3} ellipsizeMode="tail">
                {name}
              </Text>
              {metadata.map((line) => (
                <Text
                  style={styles.metadata}
                  key={line}
                  numberOfLines={2}
                  ellipsizeMode="tail">
                  {line}
                </Text>
              ))}
            </View>
            <DetailOverviewActionIconsComponent
              entity={entity}
              onAction={onAction}
              showOpenToDetailAction={showOpenToDetailAction}
              showFavoriteAction={showFavoriteAction}
              showShareAction={showShareAction}
            />
          </View>
          <Text style={styles.overview} numberOfLines={16} ellipsizeMode="clip">
            {overview}
          </Text>
        </View>
      </DetailOverviewBackdropComponent>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    alignContent: 'center',
    padding: Assets.Dimensions.Padding.LARGE,
  },
  card: {
    flexDirection: 'row',
  },
  descriptionContainer: {
    flex: 1,
    flexDirection: 'column',
    paddingStart: Assets.Dimensions.Padding.LARGE,
  },
  thumbnail: {
    height: Assets.Dimensions.ImageSize.THUMBNAIL_LARGE,
    aspectRatio: 2 / 3,
  },
  actionIconContainer: {
    width: Assets.Dimensions.ImageSize.ICON_MEDIUM,
  },
  actionIcon: {
    width: Assets.Dimensions.ImageSize.ICON_MEDIUM,
    height: Assets.Dimensions.ImageSize.ICON_MEDIUM,
    marginBottom: Assets.Dimensions.Padding.LARGE,
  },
  name: {
    fontWeight: 'bold',
    fontSize: Assets.Dimensions.FontSize.NORMAL,
    color: Assets.Colors.TEXT_TITLE,
  },
  metadata: {
    fontSize: Assets.Dimensions.FontSize.SMALL,
    marginTop: Assets.Dimensions.Padding.NORMAL,
    color: Assets.Colors.TEXT_METADATA,
  },
  overview: {
    fontSize: Assets.Dimensions.FontSize.NORMAL,
    marginVertical: Assets.Dimensions.Padding.NORMAL,
    color: Assets.Colors.TEXT_BODY,
  },
});
