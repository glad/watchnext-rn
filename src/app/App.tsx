import {NavigationContainer} from '@react-navigation/native';
import {
  createStackNavigator,
  StackCardInterpolationProps,
} from '@react-navigation/stack';
import React from 'react';
import {Assets} from './assets';
import {AppContextProvider, DependencyContextProvider} from './contexts';
import {
  DebugScreen,
  HomeScreen,
  MovieDetailScreen,
  PersonDetailScreen,
  SplashScreen,
  TestScreen,
  TvShowDetailScreen,
  TvShowEpisodeDetailScreen,
} from './screens';

const Stack = createStackNavigator();

const App = () => {
  const fadeConfig = ({current}: StackCardInterpolationProps) => {
    return {cardStyle: {opacity: current.progress}};
  };

  return (
    <DependencyContextProvider>
      <AppContextProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="SplashScreen">
            <Stack.Screen
              name="SplashScreen"
              component={SplashScreen}
              options={{headerShown: false, cardStyleInterpolator: fadeConfig}}
            />
            <Stack.Screen
              name="HomeScreen"
              component={HomeScreen}
              options={{headerShown: false, cardStyleInterpolator: fadeConfig}}
            />
            <Stack.Screen
              name="MovieDetailScreen"
              component={MovieDetailScreen}
              options={{
                headerShown: true,
                title: '',
                headerTintColor: Assets.Colors.TEXT_DEFAULT,
                headerStyle: {
                  backgroundColor: Assets.Colors.TAB_BACKGROUND,
                  elevation: 0,
                  shadowOpacity: 0,
                },
                cardStyleInterpolator: fadeConfig,
              }}
            />
            <Stack.Screen
              name="TvShowDetailScreen"
              component={TvShowDetailScreen}
              options={{
                headerShown: true,
                title: '',
                headerTintColor: Assets.Colors.TEXT_DEFAULT,
                headerStyle: {
                  backgroundColor: Assets.Colors.TAB_BACKGROUND,
                  elevation: 0,
                  shadowOpacity: 0,
                },
                cardStyleInterpolator: fadeConfig,
              }}
            />
            <Stack.Screen
              name="TvShowEpisodeDetailScreen"
              component={TvShowEpisodeDetailScreen}
              options={{
                headerShown: true,
                title: '',
                headerTintColor: Assets.Colors.TEXT_DEFAULT,
                headerStyle: {
                  backgroundColor: Assets.Colors.TAB_BACKGROUND,
                  elevation: 0,
                  shadowOpacity: 0,
                },
                cardStyleInterpolator: fadeConfig,
              }}
            />
            <Stack.Screen
              name="PersonDetailScreen"
              component={PersonDetailScreen}
              options={{
                headerShown: true,
                title: '',
                headerTintColor: Assets.Colors.TEXT_DEFAULT,
                headerStyle: {
                  backgroundColor: Assets.Colors.TAB_BACKGROUND,
                  elevation: 0,
                  shadowOpacity: 0,
                },
                cardStyleInterpolator: fadeConfig,
              }}
            />
            <Stack.Screen
              name="TestScreen"
              component={TestScreen}
              options={{headerShown: false, cardStyleInterpolator: fadeConfig}}
            />
            <Stack.Screen
              name="DebugScreen"
              component={DebugScreen}
              options={{headerShown: false, cardStyleInterpolator: fadeConfig}}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </AppContextProvider>
    </DependencyContextProvider>
  );
};

export default App;
