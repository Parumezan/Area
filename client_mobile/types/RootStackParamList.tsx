import {BrickProps} from './BrickProps';

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Dashboard: undefined;
  Services: undefined;
  Actions: {id: number};
  BrickEdit: BrickProps;

  // Add more screens here
};
