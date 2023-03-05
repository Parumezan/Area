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

  TwitterLogin: undefined;
  TwitchLogin: undefined;
  GoogleLogin: undefined;

  // Add more screens here
};
