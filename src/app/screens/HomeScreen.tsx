import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import React from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {Assets} from '../assets';
import {AppWindowComponent} from '../components';
import {MoviesListScreen} from './MoviesListScreen';
import {PeopleListScreen} from './PeopleListScreen';
import {SearchScreen} from './SearchScreen';
import {SettingsScreen} from './SettingsScreen';
import {TvShowsListScreen} from './TvShowsListScreen';

const Tabs = createMaterialBottomTabNavigator();

export const HomeScreen = () => {
  const iconSize = Assets.Dimensions.ImageSize.BOTTOM_NAV;

  return (
    <AppWindowComponent>
      <Tabs.Navigator
        initialRouteName="Movies"
        activeColor={Assets.Colors.ICON_ACTIVE}
        barStyle={{backgroundColor: Assets.Colors.WINDOW_BACKGROUND}}>
        <Tabs.Screen
          name="Movies"
          component={MoviesListScreen}
          options={{
            tabBarIcon: ({color}) => (
              <MaterialIcons
                name="local-movies"
                color={color}
                size={iconSize}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="Tv Shows"
          component={TvShowsListScreen}
          options={{
            tabBarIcon: ({color}) => (
              <MaterialIcons name="tv" color={color} size={iconSize} />
            ),
          }}
        />
        <Tabs.Screen
          name="People"
          component={PeopleListScreen}
          options={{
            tabBarIcon: ({color}) => (
              <MaterialIcons name="people" color={color} size={iconSize} />
            ),
          }}
        />
        <Tabs.Screen
          name="Search"
          component={SearchScreen}
          options={{
            tabBarIcon: ({color}) => (
              <MaterialIcons name="search" color={color} size={iconSize} />
            ),
          }}
        />
        <Tabs.Screen
          name="Settings"
          component={SettingsScreen}
          options={{
            tabBarIcon: ({color}) => (
              <MaterialIcons name="settings" color={color} size={iconSize} />
            ),
          }}
        />
      </Tabs.Navigator>
    </AppWindowComponent>
  );
};
