export interface BrickProps {
  id: number;
  title: string;
  description: string;
  active: boolean;
  actions: ActionProps[];
}

export const servicesMap: {
  [key: string]: { [key: string]: { [key: string]: string } };
} = {
  action: {
    Time: {
      TIME_IS_X: "Activates when the time is X (1 argument, ex: 12:00)",
      DAY_IS_X_TIME_IS_Y:
        "Activates when the time is X and the time is Y (2 arguments, ex: Monday|12:00)",
    },
    Crypto: {
      CRYPTO_CHECK_PRICE_UP:
        "Activates when the value goes above the given amount (2 arguments, ex: BTC|120)",
      CRYPTO_CHECK_PRICE_DOWN:
        "Activates when the value goes below the given amount (2 arguments, ex: ETH|60)",
    },
    OnePiece: {
      ONE_PIECE_GET_NEW_EP:
        "Activates when a new episode is released (no arguments)",
      ONE_PIECE_GET_NEW_MANGA:
        "Activates when a new manga is released (no arguments)",
    },
    Twitch: {
      DETECT_STREAMERS_PLAY_GAMES_TWITCH:
        "Returns a list of streamers playing a given game (1 argument, ex: League of Legends)",
      DETECT_USER_STREAM_GAMES_TWITCH:
        "Activates when a given streamer starts playing a given game (2 arguments, ex: pierre1754|Genshin Impact)",
    },
    Twitter: {
      GET_TWEETS_FROM_USER:
        "Activates when a given user posts a tweet (1 argument, ex: pichade05)",
    },
    Weather: {
      WEATHER_BY_CITY_UP:
        "Activates when the temperature goes above a given number in a given city (2 arguments, ex: Hiroshima|4000)",
      WEATHER_BY_CITY_DOWN:
        "Activates when the temperature goes below a given number in a given city (2 arguments, ex: Rennes|30)",
    },
  },
  reaction: {
    Twitch: {
      SEND_WHISPERS_TWITCH:
        "Sends a whisper to a given user (2 arguments, ex: nairodtwitch|ratio)",
      BLOCK_USER_TWITCH:
        "Block a given user (infinite arguments, ex: arto|artoto|artototo|artotototo|artototototo|artotototototo|...)",
      UNBLOCK_USER_TWITCH:
        "Unblock a given user (infinite arguments, ex: arto|artoto|artototo|artotototo|artototototo|artotototototo|...)",
    },
    Twitter: {
      POST_TWEET_FROM_BOT:
        "Posts a tweet from our bot with the given content (1 argument, ex: L'essentiel c'est le plus important et ça c'est le principal)",
      LIKE_TWEET:
        "Likes a tweet with a given tweet id (1 non-user argument, the tweet id comes from a GET_TWEETS_FROM_USER)",
      RETWEET_TWEET:
        "Retweet a tweet with a given tweet id (1 non-user argument, the tweet id comes from a GET_TWEETS_FROM_USER)",
      COMMENT_TWEET:
        "Comment on a tweet with a given tweet id (1 non-user argument, the tweet id comes from a GET_TWEETS_FROM_USER)",
      SEND_PRIVATE_MESSAGE_TWITTER:
        "Send a private message to a given user (2 arguments, ex: artototototo|*explodes your laptop battery*)",
    },
  },
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
