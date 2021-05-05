import React from 'react';
import {Text, View} from 'react-native';
import {TabBar} from 'react-native-tab-view';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {Assets} from '../assets';

export const TabBarComponent = ({props}: any) => {
  return (
    <View
      style={{
        justifyContent: 'center',
        flexDirection: 'row',
        backgroundColor: Assets.Colors.TAB_BACKGROUND,
      }}>
      <TabBar
        {...props}
        indicatorStyle={{backgroundColor: Assets.Colors.TAB_INDICATOR}}
        style={{backgroundColor: Assets.Colors.TAB_BACKGROUND}}
        tabStyle={{width: 'auto'}}
        renderLabel={({route, focused, color}) => {
          if (route.key === 'favorite') {
            return (
              <Icon
                name={focused ? 'favorite' : 'favorite-outline'}
                color={focused ? Assets.Colors.ICON_ACTIVE : color}
              />
            );
          } else {
            return (
              <Text
                style={{color: focused ? Assets.Colors.ICON_ACTIVE : color}}>
                {route.title?.toUpperCase()}
              </Text>
            );
          }
        }}
        scrollEnabled={true}
      />
    </View>
  );
};
