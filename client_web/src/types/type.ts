export interface BrickProps {
  id: number;
  title: string;
  description: string;
  active: boolean;
  actions: ActionProps[];
}

export interface ServiceProps {
  title: string;
  serviceToken: string;
  serviceRefreshToken: string;
}

export interface ActionProps {
  id: number;
  service: ServiceProps;
  description: string;
  isReaction: boolean;
  arguments: string[];
}
