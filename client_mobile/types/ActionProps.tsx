import {ServiceProps} from './ServicesProps';

export interface ActionProps {
  id: number;
  service: ServiceProps;
  description: string;
  isReaction: boolean;
  arguments: string[];
}
