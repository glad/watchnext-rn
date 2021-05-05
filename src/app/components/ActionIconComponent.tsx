import React from 'react';
import {Image, ImageSourcePropType, StyleSheet, View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {Assets} from '../assets';

export interface ActionIconComponentProps {
  icon?: ImageSourcePropType;
  tintColor?: string;
  onPress: () => void;
}

export const ActionIconComponent = ({
  icon,
  tintColor,
  onPress,
}: ActionIconComponentProps) => {
  return (
    <TouchableOpacity onPress={() => onPress && onPress()}>
      <View style={styles.iconContainer}>
        {icon && (
          <Image
            style={[
              styles.icon,
              {tintColor: tintColor || Assets.Colors.ICON_DEFAULT},
            ]}
            source={icon}
          />
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    alignSelf: 'flex-start',
    padding: Assets.Dimensions.Padding.NORMAL,
    marginBottom: Assets.Dimensions.Padding.NORMAL,
  },
  icon: {
    width: Assets.Dimensions.ImageSize.ICON_MEDIUM,
    height: Assets.Dimensions.ImageSize.ICON_MEDIUM,
  },
});
