import {ContentLoadingEntity, Entity} from '@watchnext-domain/entities';
import {Result} from '@watchnext-domain/misc';
import React from 'react';
import {View} from 'react-native';
import {Assets} from '../assets';
import {EmptyContentComponent} from './EmptyContentComponent';
import {FetchDetailContentProps} from './FetchDetailContentProps';

export interface DetailOverviewComponentProps<
  T extends FetchDetailContentProps
> {
  params: T;
  fetchContentCallback: (params: T) => Promise<Result<Entity>>;
  entityToComponent: (entity: Entity) => React.ReactElement;
}

export interface DetailOverviewComponentExtraProps {
  showBackdrop?: boolean;
  showOpenToDetailAction?: boolean;
  showFavoriteAction?: boolean;
  showShareAction?: boolean;
}

export const DetailOverviewComponent = <T extends FetchDetailContentProps>({
  params,
  fetchContentCallback,
  entityToComponent,
}: DetailOverviewComponentProps<T>) => {
  const [content, setContent] = React.useState<Entity | undefined>(
    ContentLoadingEntity.newInstance(),
  );
  const [errorMessage, setErrorMessage] = React.useState<string | undefined>(
    undefined,
  );
  const isFetching = React.useRef(false);

  const fetchContent = () => {
    if (isFetching.current) {
      return undefined;
    }
    isFetching.current = true;

    fetchContentCallback(params)
      .then((result) => {
        if (result.throwable) {
          throw result.throwable;
        }

        setContent(result.data!!);
        setErrorMessage(undefined);
        isFetching.current = false;
      })
      .catch((error) => {
        setErrorMessage(Assets.Strings.ERROR(error));
        setContent(undefined);
        isFetching.current = false;
      });
  };

  React.useEffect(() => fetchContent(), []);

  return (
    <View style={{flex: 1, backgroundColor: Assets.Colors.MODAL_BACKGROUND}}>
      {content && entityToComponent(content)}
      {errorMessage && <EmptyContentComponent message={errorMessage} />}
    </View>
  );
};
