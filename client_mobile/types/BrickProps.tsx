import {ActionProps} from './ActionProps';

export interface BrickProps {
  id: number;
  title: string;
  description: string;
  active: boolean;
  actions: ActionProps[];
}
