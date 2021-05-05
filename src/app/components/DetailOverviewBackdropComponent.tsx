import React from 'react';
import {Image, useWindowDimensions, View} from 'react-native';

export type DetailOverviewBackdropComponentProps = {
  id: string;
  backdropUrl?: string;
  children?: React.ReactElement<any, string | React.JSXElementConstructor<any>>;
};

export const DetailOverviewBackdropComponent = ({
  id,
  backdropUrl,
  children,
}: DetailOverviewBackdropComponentProps) => {
  const [backdropLoaded, setBackdropLoaded] = React.useState(false);
  const [backdropSize, setBackdropSize] = React.useState<
    [number, number] | undefined
  >(undefined);
  const window = useWindowDimensions();

  React.useEffect(() => {
    if (backdropUrl) {
      (async () => {
        setTimeout(() => setBackdropLoaded(true), 5000); // Allow at least 5-sec for backdrop to load
        await Image.prefetch(backdropUrl)
          .then(() => {
            Image.getSize(
              backdropUrl,
              (width, height) => {
                setBackdropSize([
                  window.width,
                  window.width / (width / height),
                ]);
                setBackdropLoaded(true);
              },
              (_) => setBackdropLoaded(true),
            );
          })
          .catch((_) => setBackdropLoaded(true));
      })();
    } else {
      setBackdropLoaded(true);
    }
  }, []);

  return (
    <View style={{flex: 1}} key={id}>
      {backdropLoaded && backdropSize && (
        <Image
          style={{width: backdropSize[0], height: backdropSize[1]}}
          source={{uri: backdropUrl}}
        />
      )}
      {backdropLoaded && children}
    </View>
  );
};
