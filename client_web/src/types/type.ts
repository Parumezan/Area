export interface BrickProps {
  id: number;
  title: string;
  description: string;
  active: boolean;
  actions: ActionProps[];
}

export const servicesMap: {
  [key: string]: { [key: string]: { type: string; description: string }[] };
} = {
  action: {
    Time: [
      {
        type: "TIME_IS_X",
        description: "Activates when the time is X (1 argument, ex: 12:00)",
      },
      {
        type: "DAY_IS_X_TIME_IS_Y",
        description:
          "Activates when the day is X and the time is Y (1 argument, ex: Monday, 12:00)",
      },
    ],
    Crypto: [
      {
        type: "CRYPTO_CHECK_PRICE_UP",
        description:
          "Activates when the value goes above the given amount (2 arguments, ex: BTC|120)",
      },
      {
        type: "CRYPTO_CHECK_PRICE_DOWN",
        description:
          "Activates when the value goes below the given amount (2 arguments, ex: ETH|60)",
      },
    ],
    OnePiece: [
      {
        type: "ONE_PIECE_GET_NEW_EP",
        description: "Activates when a new episode is released (no arguments)",
      },
    ],
    Twitch: [
      {
        type: "DETECT_STREAMERS_PLAY_GAMES_TWITCH",
        description:
          "Returns a list of streamers playing a given game (1 argument, ex: League of Legends)",
      },
      {
        type: "DETECT_USER_STREAM_GAMES_TWITCH",
        description:
          "Activates when a given streamer starts playing a given game (2 arguments, ex: pierre1754|Genshin Impact)",
      },
    ],
    Twitter: [
      {
        type: "GET_TWEETS_FROM_USER",
        description:
          "Activates when a given user posts a tweet (1 argument, ex: pichade05)",
      },
    ],
    Weather: [
      {
        type: "WEATHER_BY_CITY_UP",
        description:
          "Activates when the temperature goes above a given number in a given city (2 arguments, ex: Hiroshima|4000)",
      },
      {
        type: "WEATHER_BY_CITY_DOWN",
        description:
          "Activates when the temperature goes below a given number in a given city (2 arguments, ex: Rennes|30)",
      },
    ],
  },
  reaction: {
    Twitch: [
      {
        type: "SEND_WHISPERS_TWITCH",
        description:
          "Sends a whisper to a given user (2 arguments, ex: nairodtwitch|ratio",
      },
      {
        type: "BLOCK_USER_TWITCH",
        description:
          "Block a given user (infinite arguments, ex: arto|artoto|artototo|artotototo|artototototo|artotototototo|...",
      },
      {
        type: "UNBLOCK_USER_TWITCH",
        description:
          "Unblock a given user (infinite arguments, ex: arto|artoto|artototo|artotototo|artototototo|artotototototo|...",
      },
    ],
    Twitter: [
      {
        type: "POST_TWEET_FROM_BOT",
        description:
          "Posts a tweet from our bot with the given content (1 argument, ex: L'essentiel c'est le plus important et ça c'est le principal)",
      },
      {
        type: "LIKE_TWEET",
        description:
          "Likes a tweet with a given tweet id (1 non-user argument, the tweet id comes from a GET_TWEETS_FROM_USER)",
      },
      {
        type: "RETWEET_TWEET",
        description:
          "Retweet a tweet with a given tweet id (1 non-user argument, the tweet id comes from a GET_TWEETS_FROM_USER)",
      },
      {
        type: "COMMENT_TWEET",
        description:
          "Comment on a tweet with a given tweet id (1 non-user argument, the tweet id comes from a GET_TWEETS_FROM_USER)",
      },
      {
        type: "SEND_PRIVATE_MESSAGE",
        description:
          "Send a private message to a given user (2 arguments, ex: artototototo|*explodes your laptop battery*)",
      },
    ],
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
