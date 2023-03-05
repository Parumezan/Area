export interface ActionProps {
  id: number;
  serviceName: string;
  description: string;
  arguments: string[];
  brickId: number;
  serviceId: number;
  actionType: string;
  isInput: boolean;
}

export type ServiceType = {
  service: string;
  isInput: boolean;
  type: string;
  description: string;
};
