import {Entity} from '@watchnext-domain/entities';
import React from 'react';
import {Assets} from '../assets';
import {ActionIconComponent} from './ActionIconComponent';
import {OnActionProps} from './OnActionProps';

export interface ShareActionIconComponentProps {
  entity: Entity;
  onAction?: OnActionProps;
}

export const ShareActionIconComponent = ({
  entity,
  onAction,
}: ShareActionIconComponentProps) => {
  const action = 'Share';

  return (
    <ActionIconComponent
      icon={Assets.Icons.SHARE}
      tintColor={Assets.Colors.ICON_DEFAULT}
      onPress={() => onAction?.onPress?.(action, entity)}
    />
  );
};
