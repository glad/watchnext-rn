import {Entity} from '@watchnext-domain/entities';

export interface OnActionProps {
  onLoad?: (
    action: string,
    entity: Entity,
    resultCallback?: (result: any) => void,
  ) => void;
  onPress?: (
    action: string,
    params: any,
    resultCallback?: (result: any) => void,
  ) => void;
}
