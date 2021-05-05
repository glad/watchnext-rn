import {EmptySearchHistoryThrowable} from '@watchnext-domain/throwables';
import React from 'react';
import {FlatList, Image, Pressable, StyleSheet, Text, View} from 'react-native';
import {Assets} from '../assets';
import {EmptyContentComponent} from './EmptyContentComponent';

export interface SearchHistoryComponentProps {
  fetchHistoryCallback: () => Promise<string[]>;
  selectFromHistoryCallback: (query: string) => void;
  deleteFromHistoryCallback: (query: string) => void;
  refreshState: number;
}

export const SearchHistoryComponent = React.memo(
  ({
    fetchHistoryCallback,
    selectFromHistoryCallback,
    deleteFromHistoryCallback,
    refreshState,
  }: SearchHistoryComponentProps) => {
    const [history, setHistory] = React.useState<string[]>([]);
    const [errorMessage, setErrorMessage] = React.useState<string | undefined>(
      undefined,
    );
    const isFetching = React.useRef(false);

    const fetchHistory = React.useCallback(() => {
      if (isFetching.current) {
        return undefined;
      }
      isFetching.current = true;

      fetchHistoryCallback()
        .then((history) => {
          if (history.length === 0) {
            throw EmptySearchHistoryThrowable.INSTANCE;
          }

          setHistory(history);
          setErrorMessage(undefined);
          isFetching.current = false;
        })
        .catch((error) => {
          setErrorMessage(Assets.Strings.ERROR(error));
          setHistory([]);
          isFetching.current = false;
        });
    }, []);

    const renderItem = React.useCallback(
      (query: string, index: number) => (
        <View style={styles.item}>
          <Pressable
            style={{flex: 1, padding: Assets.Dimensions.Padding.NORMAL}}
            android_ripple={{color: Assets.Colors.RIPPLE}}
            onPress={() => selectFromHistoryCallback(query)}>
            <Text key={query} style={styles.text}>
              {query}
            </Text>
          </Pressable>
          <Pressable
            style={{padding: Assets.Dimensions.Padding.NORMAL}}
            android_ripple={{color: Assets.Colors.RIPPLE}}
            onPress={() => deleteFromHistoryCallback(query)}>
            <Image
              source={Assets.Icons.DELETE}
              style={styles.delete}
              resizeMode="contain"
            />
          </Pressable>
        </View>
      ),
      [],
    );

    React.useEffect(fetchHistory, [refreshState]);

    return (
      <View style={{flex: 1}}>
        {errorMessage && <EmptyContentComponent message={errorMessage} />}
        {history.length > 0 ? (
          <View style={{flex: 1}}>
            <Text style={styles.header}>Recent searches</Text>
            <FlatList
              data={history}
              keyExtractor={(query) => query}
              renderItem={({item, index}) => renderItem(item, index)}
              onRefresh={fetchHistory}
              refreshing={false}
            />
          </View>
        ) : null}
      </View>
    );
  },
);

const styles = StyleSheet.create({
  item: {
    flex: 1,
    flexDirection: 'row',
    padding: Assets.Dimensions.Padding.NORMAL,
    marginTop: Assets.Dimensions.Padding.NORMAL,
  },
  header: {
    textAlign: 'center',
    padding: Assets.Dimensions.Padding.NORMAL,
    marginHorizontal: Assets.Dimensions.Padding.NORMAL,
    color: Assets.Colors.TEXT_DEFAULT,
    fontSize: Assets.Dimensions.FontSize.LARGE,
    opacity: 0.25,
  },
  text: {
    paddingHorizontal: Assets.Dimensions.Padding.LARGE,
    color: Assets.Colors.TEXT_DEFAULT,
  },
  delete: {
    width: Assets.Dimensions.ImageSize.ICON_SMALL,
    height: Assets.Dimensions.ImageSize.ICON_SMALL,
    paddingHorizontal: Assets.Dimensions.Padding.LARGE,
  },
});
