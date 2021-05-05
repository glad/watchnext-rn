import {Entity} from '@watchnext-domain/entities';
import {Result} from '@watchnext-domain/misc';
import React from 'react';
import {View} from 'react-native';
import {TabView} from 'react-native-tab-view';
import {Assets} from '../assets';
import {useDependencyContext} from '../contexts';
import {DetailOverviewPopupComponent} from './DetailOverviewPopupComponent';
import {FetchDetailContentProps} from './FetchDetailContentProps';
import {OnActionProps} from './OnActionProps';
import {TabBarComponent} from './TabBarComponent';

export interface TabsWithDetailOverviewPopupComponentTabProps {
  key: string;
  title: string;
  component: React.ReactElement;
}

export interface TabsWithDetailOverviewPopupComponentProps {
  tabs: TabsWithDetailOverviewPopupComponentTabProps[];
  initialTabPosition?: number;
  fetchDetailCallback: (
    params: FetchDetailContentProps,
  ) => Promise<Result<Entity>>;
  onAction?: OnActionProps;
  selectedDetailOverviewPopupParams?: any;
}
export const TabsWithDetailOverviewPopupComponent = ({
  tabs,
  initialTabPosition,
  fetchDetailCallback,
  onAction,
  selectedDetailOverviewPopupParams,
}: TabsWithDetailOverviewPopupComponentProps) => {
  const {entityToComponentMapper} = useDependencyContext();

  const [index, setTabIndex] = React.useState(0);
  const [routes] = React.useState(tabs);
  const renderScene = ({route}: any) =>
    tabs.find(
      (tab: TabsWithDetailOverviewPopupComponentTabProps) =>
        tab.key === route.key,
    )?.component;
  const renderTabBar = (props: any) => <TabBarComponent props={props} />;

  React.useEffect(() => {
    setTimeout(() => {
      tabs.forEach((tab, index) => {
        if (initialTabPosition === index) {
          setTabIndex(index);
        }
      });
    });
  }, []);

  return (
    <View style={{flex: 1, backgroundColor: Assets.Colors.WINDOW_BACKGROUND}}>
      {/*@ts-ignore ts(2322)*/}
      <TabView
        navigationState={{index, routes}}
        renderTabBar={renderTabBar}
        renderScene={renderScene}
        onIndexChange={setTabIndex}
      />
      <DetailOverviewPopupComponent
        selectedParams={selectedDetailOverviewPopupParams}
        fetchContentCallback={fetchDetailCallback}
        entityToComponent={(entity) =>
          entityToComponentMapper.toDetailOverview(entity, onAction, {
            showBackdrop: false,
            showOpenToDetailAction: true,
            showFavoriteAction: true,
            showShareAction: true,
          })
        }
      />
    </View>
  );
};
