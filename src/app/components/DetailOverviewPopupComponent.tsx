import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetModalProvider,
} from '@gorhom/bottom-sheet';
import {Entity} from '@watchnext-domain/entities';
import {Result} from '@watchnext-domain/misc';
import React from 'react';
import {View} from 'react-native';
import {DetailOverviewComponent} from './DetailOverviewComponent';
import {FetchDetailContentProps} from './FetchDetailContentProps';

export interface DetailOverviewPopupComponentProps {
  fetchContentCallback: (
    params: FetchDetailContentProps,
  ) => Promise<Result<Entity>>;
  entityToComponent: (entity: Entity) => React.ReactElement;
  selectedParams?: any;
}

export const DetailOverviewPopupComponent = React.memo(
  ({
    fetchContentCallback,
    entityToComponent,
    selectedParams,
  }: DetailOverviewPopupComponentProps) => {
    const bottomSheetModal = {
      ref: React.useRef<BottomSheetModal>(null),
      snapPoints: React.useMemo(() => ['45%', '100%'], []),
    };

    React.useEffect(() => {
      if (selectedParams !== undefined) {
        bottomSheetModal.ref.current?.present();
      }
    }, [selectedParams]);

    return (
      <BottomSheetModalProvider>
        <BottomSheetModal
          ref={bottomSheetModal.ref}
          snapPoints={bottomSheetModal.snapPoints}
          backdropComponent={BottomSheetBackdrop}>
          <View style={{flex: 1}}>
            {selectedParams === undefined ? null : (
              <DetailOverviewComponent
                params={selectedParams}
                fetchContentCallback={fetchContentCallback}
                entityToComponent={entityToComponent}
              />
            )}
          </View>
        </BottomSheetModal>
      </BottomSheetModalProvider>
    );
  },
);
