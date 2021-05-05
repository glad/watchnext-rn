import {
  Entity,
  EpisodeSimpleEntity,
  ImageEntity,
  MovieSimpleEntity,
  PersonSimpleEntity,
} from '@watchnext-domain/entities';
import React from 'react';
import {View} from 'react-native';
import {Assets} from '../assets';
import {
  DetailOverviewComponent,
  FetchTvShowDetailContentProps,
  SimpleContentCardComponent,
} from '../components';
import {ThumbnailContentComponent} from '../components/ThumbnailContentComponent';
import {useDependencyContext} from '../contexts';
import {useOnAction} from '../hooks';

export const TestScreen = () => {
  const {contentProvider, entityToComponentMapper} = useDependencyContext();
  const {onAction} = useOnAction();

  const personSimple = new PersonSimpleEntity({
    id: '123',
    name: 'john',
    profileImageUrls: [
      new ImageEntity({
        width: 185,
        url: 'https://image.tmdb.org/t/p/w185/ilPBHd3r3ahlipNQtjr4E3G04jJ.jpg',
      }),
    ],
  });

  const movieSimple = new MovieSimpleEntity({
    id: '1979',
    title: 'Fantastic Four: Rise of the Silver Surfer',
    overview:
      "The Fantastic Four return to the big screen as a new and all powerful enemy threatens the Earth. The seemingly unstoppable 'Silver Surfer', but all is not what it seems and there are old and new enemies that pose a greater threat than the intrepid superheroes realize.",
    releaseYear: '1992',
    posterImageUrls: [
      new ImageEntity({
        width: 185,
        url: 'https://image.tmdb.org/t/p/w185/9wRfzTcMyyzkQxVDqBHv8RwuZOv.jpg',
      }),
    ],
    backdropImageUrls: [],
  });

  const episodeSimple = new EpisodeSimpleEntity({
    tvShowId: '1979',
    season: 123,
    episode: 456,
    name: 'Fantastic Four: Rise of the Silver Surfer',
    overview:
      "The Fantastic Four return to the big screen as a new and all powerful enemy threatens the Earth. The seemingly unstoppable 'Silver Surfer', but all is not what it seems and there are old and new enemies that pose a greater threat than the intrepid superheroes realize.",
    stillImageUrls: [
      new ImageEntity({
        width: 185,
        url: 'https://image.tmdb.org/t/p/w300/xIfvIM7YgkADTrqp23rm3CLaOVQ.jpg',
      }),
    ],
  });

  const fetchOverviewDetailCallback = React.useCallback(
    (_) => contentProvider.fetchTvShowEpisodeDetail('1399', 1, 1),
    [],
  );

  return (
    <View style={{flex: 1, backgroundColor: Assets.Colors.WINDOW_BACKGROUND}}>
      <View style={{flexDirection: 'row'}}>
        <ThumbnailContentComponent
          index={0}
          id={personSimple.id}
          type={personSimple.type}
          onPress={() => {}}
          thumbnailUrl={personSimple.profileImageUrls[0].url}
          placeholderText={personSimple.name}
        />
        <ThumbnailContentComponent
          index={0}
          id={personSimple.id}
          type={personSimple.type}
          onPress={() => {}}
          thumbnailUrl={personSimple.profileImageUrls[0].url}
          placeholderText={personSimple.name}
        />
        <ThumbnailContentComponent
          index={0}
          id={personSimple.id}
          type={personSimple.type}
          onPress={() => {}}
          thumbnailUrl={personSimple.profileImageUrls[0].url}
          placeholderText={personSimple.name}
        />
        <ThumbnailContentComponent
          index={0}
          id={personSimple.id}
          type={personSimple.type}
          onPress={() => {}}
          thumbnailUrl={personSimple.profileImageUrls[0].url}
          placeholderText={personSimple.name}
        />
      </View>

      <SimpleContentCardComponent
        index={0}
        id={movieSimple.id}
        type={movieSimple.type}
        onPress={() => {}}
        primaryTitle={movieSimple.title}
        secondaryTitle={movieSimple.releaseYear}
        thumbnailUrl={movieSimple.posterImageUrls[0].url}
      />
      <SimpleContentCardComponent
        index={0}
        id={episodeSimple.id}
        type={episodeSimple.type}
        onPress={() => {}}
        primaryTitle={episodeSimple.season.toString()}
        secondaryTitle={episodeSimple.episode.toString()}
        thumbnailUrl={episodeSimple.stillImageUrls[0].url}
        landscape={true}
      />
      <DetailOverviewComponent
        params={new FetchTvShowDetailContentProps('1399')}
        entityToComponent={(entity: Entity) => {
          return entityToComponentMapper.toDetailOverview(entity, onAction, {
            showBackdrop: true,
            showOpenToDetailAction: false,
            showFavoriteAction: true,
            showShareAction: true,
          });
        }}
        fetchContentCallback={fetchOverviewDetailCallback}
      />
    </View>
  );
};
