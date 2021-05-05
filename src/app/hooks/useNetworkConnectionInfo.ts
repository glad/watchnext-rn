import NetInfo, {NetInfoStateType} from '@react-native-community/netinfo';
import React from 'react';
import {useDependencyContext} from './../contexts';

export enum NetworkConnectionState {
  CONNECTED = 'CONNECTED',
  DISCONNECTED = 'DISCONNECTED',
}

export enum NetworkConnectionType {
  WIFI = 'WIFI',
  CELLULAR = 'CELLULAR',
  OTHER = 'OTHER',
}

export interface NetworkConnectionServiceInfo {
  ConnectionState: NetworkConnectionState;
  ConnectionType: NetworkConnectionType;
  IsConnected: boolean;
}

export const useNetworkConnectionInfo = () => {
  const {logger} = useDependencyContext();
  const [connectionState, setConnectionState] = React.useState(
    NetworkConnectionState.CONNECTED,
  );
  const [connectionType, setConnectionType] = React.useState(
    <NetworkConnectionType | undefined>undefined,
  );

  React.useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setConnectionState((previousState) => {
        const newState =
          state.isConnected && state.isInternetReachable
            ? NetworkConnectionState.CONNECTED
            : NetworkConnectionState.DISCONNECTED;
        if (newState !== previousState) {
          logger.i(
            `Network state changed from ${previousState} to ${newState}`,
          );
          return newState;
        } else {
          return previousState;
        }
      });

      setConnectionType((previousType) => {
        var newType = previousType;

        if (state.type === NetInfoStateType.cellular) {
          newType = NetworkConnectionType.CELLULAR;
        } else if (state.type === NetInfoStateType.wifi) {
          newType = NetworkConnectionType.WIFI;
        } else {
          newType = NetworkConnectionType.OTHER;
        }

        if (newType !== previousType) {
          logger.i(`Network type changed from ${previousType} to ${newType}`);
          return newType;
        } else {
          return previousType;
        }
      });

      return () => {
        logger.d('Cleaning up useNetworkConnectionInfo()');
        unsubscribe();
      };
    });
  });

  return <NetworkConnectionServiceInfo>{
    ConnectionState: connectionState,
    ConnectionType: connectionType,
    IsConnected: connectionState === NetworkConnectionState.CONNECTED,
  };
};
