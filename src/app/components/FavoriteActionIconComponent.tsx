import {Entity} from '@watchnext-domain/entities';
import React from 'react';
import {Assets} from '../assets';
import {ActionIconComponent} from './ActionIconComponent';
import {OnActionProps} from './OnActionProps';

export interface FavoriteContentActionIconComponentProps {
  entity: Entity;
  onAction?: OnActionProps;
}

export const FavoriteContentActionIconComponent = ({
  entity,
  onAction,
}: FavoriteContentActionIconComponentProps) => {
  const action = 'FavoriteContent';

  const [isFavorited, setIsFavorited] = React.useState(false);

  const onPress = React.useCallback(() => {
    onAction?.onPress?.(action, entity, setIsFavorited);
  }, [entity]);

  React.useEffect(() => {
    onAction?.onLoad?.(action, entity, setIsFavorited);
  }, [entity]);

  return (
    <ActionIconComponent
      icon={isFavorited ? Assets.Icons.HEART_SOLID : Assets.Icons.HEART_OUTLINE}
      tintColor={
        isFavorited ? Assets.Colors.ICON_ACTIVE : Assets.Colors.ICON_INACTIVE
      }
      onPress={onPress}
    />
  );
};
