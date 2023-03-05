import {ActionProps} from './ActionProps';
import {BrickProps} from './BrickProps';

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Dashboard: undefined;
  Services: undefined;
  Actions: {id: number};
  BrickEdit: BrickProps;
  ActionsEdit: {brickId: number} & ActionProps;

  // Add more screens here
};
