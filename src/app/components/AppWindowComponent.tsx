import React from 'react';
import {SafeAreaView, StatusBar, View} from 'react-native';
import {Assets} from '../assets';
import {NetworkInfoComponent} from './NetworkInfoComponent';

export const AppWindowComponent = (props: any) => {
  return (
    <SafeAreaView
      style={{flex: 1, backgroundColor: Assets.Colors.WINDOW_BACKGROUND}}>
      <StatusBar
        animated={true}
        backgroundColor={Assets.Colors.PRIMARY_DARK}
        barStyle="default"
        showHideTransition="slide"
      />
      <View style={{flex: 1}}>
        <View style={{flex: 1}}>{props.children}</View>
        <View style={{height: 'auto'}}>
          <NetworkInfoComponent />
        </View>
      </View>
    </SafeAreaView>
  );
};
