import React from 'react';
import {StyleSheet, TextInput, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {Assets} from '../assets';

const MIN_SEARCH_QUERY_LENGTH = 3;

interface SearchBarComponentProps {
  updateInputQuery: string | undefined;
  performSearchCallback: (query: string) => void;
}

export const SearchBarComponent = ({
  updateInputQuery,
  performSearchCallback,
}: SearchBarComponentProps) => {
  const [inputQuery, setInputQuery] = React.useState<string | undefined>();

  const debounceTimeout = React.useRef<any>();
  React.useEffect(() => {
    if (debounceTimeout.current !== undefined) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(() => {
      const query = inputQuery || '';
      if (query.length === 0 || query.length >= MIN_SEARCH_QUERY_LENGTH) {
        performSearchCallback(query);
      }
    }, 500);
  }, [inputQuery]);

  React.useEffect(() => setInputQuery(updateInputQuery), [updateInputQuery]);

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          placeholder={Assets.Strings.SEARCH_HINT}
          style={styles.input}
          onChangeText={setInputQuery}
          value={inputQuery}
          maxLength={32}
          numberOfLines={1}
        />
        <Icon
          style={styles.icon}
          color={Assets.Colors.PRIMARY_DARK}
          name={inputQuery?.length !== 0 ? 'cancel' : 'search'}
          onPress={() => {
            if (inputQuery?.length !== 0) {
              setInputQuery('');
            }
          }}
          size={Assets.Dimensions.ImageSize.ICON_MEDIUM}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Assets.Colors.PRIMARY,
    height: Assets.Numbers.TOOLBAR_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Assets.Dimensions.Padding.SMALL,
  },
  inputContainer: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: Assets.Colors.PRIMARY_DARK,
    justifyContent: 'center',
    backgroundColor: Assets.Colors.WINDOW_BACKGROUND_INVERSE,
  },
  input: {
    flex: 1,
    alignSelf: 'center',
    marginHorizontal: Assets.Dimensions.Padding.NORMAL,
  },
  icon: {
    alignSelf: 'center',
    marginHorizontal: Assets.Dimensions.Padding.NORMAL,
  },
});
