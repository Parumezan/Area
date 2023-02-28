export interface BrickProps {
  id: number;
  title: string;
  description: string;
  active: boolean;
  actions: ActionProps[];
}

export const servicesMap: { [key: string]: string[] } = {
  Time: ["TIME_IS_X", "DAY_IS_X_TIME_IS_Y"],
  Crypto: [""],
  Meteo: [""],
  Twitter: ["GET_TWEETS_FROM_USER", "POST_TWEET_FROM_BOT"],
  Twitch: ["SEND_WHISPERS_TWITCH", "BLOCK_USER_TWITCH", "UNBLOCK_USER_TWITCH"],
};

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

export interface ServiceProps {
  id: number;
  title: string;
}
