import {
  DefaultSettingsProviderData,
  SettingsProviderData,
} from '@watchnext-domain/providers';
import React from 'react';
import {useDependencyContext} from './DependencyContext';

interface AppContextProps {
  appSettings: SettingsProviderData;
  setAppSettings: (settings: SettingsProviderData) => void;
  clearCache: () => void;

  favoriteContentRefreshState: number;
  setFavoriteContentRefreshState: React.Dispatch<React.SetStateAction<any>>;
}

export const AppContext = React.createContext<AppContextProps | undefined>(
  undefined,
);

export const AppContextProvider = (props: any) => {
  const {settingsProvider} = useDependencyContext();
  const [appSettings, setAppSettings] = React.useState<SettingsProviderData>(
    DefaultSettingsProviderData,
  );
  const [
    favoriteContentRefreshState,
    setFavoriteContentRefreshState,
  ] = React.useState<number>(0);

  return (
    <AppContext.Provider
      value={{
        appSettings: appSettings,
        setAppSettings: (settings: SettingsProviderData) => {
          setAppSettings(settings);
          settingsProvider.setSettings(settings);
        },
        clearCache: () => settingsProvider.clearCache(),
        favoriteContentRefreshState,
        setFavoriteContentRefreshState,
      }}>
      {props.children}
    </AppContext.Provider>
  );
};

export const useAppContext = (): AppContextProps => {
  const context: AppContextProps | undefined = React.useContext(AppContext)!!;

  if (context === undefined) {
    throw new Error('Failed to find AppContextProvider');
  }

  return context!!;
};
