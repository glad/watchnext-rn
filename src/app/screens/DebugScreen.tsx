import React from 'react';
import {ScrollView, StyleSheet, Text} from 'react-native';
import {Assets} from '../assets';
import {useDependencyContext} from '../contexts';

export const DebugScreen = () => {
  const {logger} = useDependencyContext();
  const [debugText, setDebugText] = React.useState('');

  React.useEffect(() => {
    setInterval(() => {
      setDebugText(logger.lines.reduce((x, y) => y + '\n' + x, ''));
    }, 1000);
  }, []);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.text}>{debugText}</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Assets.Colors.WINDOW_BACKGROUND,
  },
  text: {
    flex: 1,
    fontSize: Assets.Dimensions.FontSize.SMALL,
    margin: Assets.Dimensions.Padding.NORMAL,
    padding: Assets.Dimensions.Padding.NORMAL,
    backgroundColor: Assets.Colors.TEXT_DEFAULT,
  },
});
