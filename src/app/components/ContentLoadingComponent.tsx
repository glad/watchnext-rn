import React from 'react';
import {ActivityIndicator, View} from 'react-native';
import {Assets} from '../assets';

export function ContentLoadingComponent() {
  return (
    <View style={{flex: 1, padding: Assets.Dimensions.Padding.LARGE}}>
      <ActivityIndicator color={Assets.Colors.ACCENT} animating={true} />
    </View>
  );
}
