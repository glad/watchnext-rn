import React from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import {Assets} from '../assets';
import {useNetworkConnectionInfo} from '../hooks';

export const NetworkInfoComponent = () => {
  const networkServiceInfo = useNetworkConnectionInfo();

  const isConnected = React.useRef(true);
  const [isVisible, setIsVisible] = React.useState(false);

  const [stateLabel, setStateLabel] = React.useState('');
  const [stateStyle, setStateStyle] = React.useState({});
  const [stateIcon, setStateIcon] = React.useState(
    Assets.Icons.NETWORK_STATE_CONNECTED,
  );

  React.useEffect(() => {
    if (!isConnected.current && networkServiceInfo.IsConnected) {
      setIsVisible(true);
      setStateStyle(styles.stateRestored);
      setStateIcon(Assets.Icons.NETWORK_STATE_CONNECTED);
      setStateLabel(Assets.Strings.NETWORK_STATE_RESTORED);
    } else if (!networkServiceInfo.IsConnected) {
      setIsVisible(true);
      setStateStyle(styles.stateDisconnected);
      setStateIcon(Assets.Icons.NETWORK_STATE_DISCONNECTED);
      setStateLabel(Assets.Strings.NETWORK_STATE_DISCONNECTED);
    }

    const timeout = setTimeout(() => {
      setIsVisible(false);
    }, 2000);

    isConnected.current = networkServiceInfo.IsConnected;

    return () => {
      clearTimeout(timeout);
    };
  }, [networkServiceInfo]);

  return (
    <View style={[styles.container, isVisible ? {} : {height: 0}]}>
      <View style={[styles.state, stateStyle]}>
        <Image source={stateIcon} style={styles.stateIcon} />
        <Text style={styles.stateLabel}>{stateLabel}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: Assets.Numbers.TOOLBAR_HEIGHT,
    alignSelf: 'center',
  },
  state: {
    flexDirection: 'row',
    flex: 1,
    padding: Assets.Dimensions.Padding.LARGE,
  },
  stateRestored: {
    backgroundColor: Assets.Colors.NETWORK_STATE_RESTORED_BACKGROUND,
  },
  stateDisconnected: {
    position: 'relative',
    width: '100%',
    backgroundColor: Assets.Colors.NETWORK_STATE_DISCONNECTED_BACKGROUND,
  },
  stateIcon: {
    width: Assets.Dimensions.ImageSize.ICON_MEDIUM,
    height: Assets.Dimensions.ImageSize.ICON_MEDIUM,
    alignSelf: 'center',
  },
  stateLabel: {
    alignSelf: 'center',
    textAlignVertical: 'center',
    marginStart: Assets.Dimensions.Padding.LARGE,
    color: Assets.Colors.TEXT_DEFAULT,
    height: 'auto',
  },
});
