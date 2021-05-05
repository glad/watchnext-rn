import {Entity} from '@watchnext-domain/entities';
import React from 'react';
import {View} from 'react-native';
import {FavoriteContentActionIconComponent} from './FavoriteActionIconComponent';
import {OnActionProps} from './OnActionProps';
import {OpenToDetailActionIconComponent} from './OpenToDetailActionIconComponent';
import {ShareActionIconComponent} from './ShareActionIconComponent';

export interface DetailOverviewActionIconsComponentProps {
  entity: Entity;
  onAction?: OnActionProps;
  showOpenToDetailAction?: boolean;
  showFavoriteAction?: boolean;
  showShareAction?: boolean;
}

export const DetailOverviewActionIconsComponent = ({
  entity,
  onAction,
  showOpenToDetailAction,
  showFavoriteAction,
  showShareAction,
}: DetailOverviewActionIconsComponentProps) => {
  return (
    <View style={{alignSelf: 'flex-start'}}>
      {showOpenToDetailAction && (
        <OpenToDetailActionIconComponent entity={entity} onAction={onAction} />
      )}
      {showFavoriteAction && (
        <FavoriteContentActionIconComponent
          entity={entity}
          onAction={onAction}
        />
      )}
      {showShareAction && (
        <ShareActionIconComponent entity={entity} onAction={onAction} />
      )}
    </View>
  );
};
