import {Entity} from '@watchnext-domain/entities';
import React from 'react';
import {Assets} from '../assets';
import {ActionIconComponent} from './ActionIconComponent';
import {OnActionProps} from './OnActionProps';

export interface OpenToDetailActionIconComponentProps {
  entity: Entity;
  onAction?: OnActionProps;
}

export const OpenToDetailActionIconComponent = ({
  entity,
  onAction,
}: OpenToDetailActionIconComponentProps) => {
  const action = 'OpenToDetail';

  return (
    <ActionIconComponent
      icon={Assets.Icons.NAVIGATE_TO_DETAIL_SCREEN}
      tintColor={Assets.Colors.ICON_DEFAULT}
      onPress={() => onAction?.onPress?.(action, entity)}
    />
  );
};
