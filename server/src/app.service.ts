import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  redirect(req: any, res: any) {
    if (req.headers.authorization) {
      return res.redirect('/dashboard');
    }
    return res.redirect('/auth/login');
  }

  about(ip: string) {
    return {
      client: {
        host: ip,
      },
      server: {
        current_time: Date.now().valueOf(),
        services: [
          {
            name: 'time',
            actions: [
              {
                name: 'TIME_IS_X',
                description:
                  'Activates when the time is X (1 argument, ex: 12:00)',
              },
              {
                name: 'DAY_IS_X_TIME_IS_Y',
                description:
                  'Activates when the day is X and the time is Y (1 argument, ex: Monday, 12:00)',
              },
            ],
            reactions: [],
          },
          {
            name: 'crypto',
            actions: [
              {
                name: 'CRYPTO_CHECK_PRICE_UP',
                description:
                  'Activates when the value goes above the given amount (2 arguments, ex: BTC|120)',
              },
              {
                name: 'CRYPTO_CHECK_PRICE_DOWN',
                description:
                  'Activates when the value goes below the given amount (2 arguments, ex: ETH|60)',
              },
            ],
            reactions: [],
          },
          {
            name: 'weather',
            actions: [
              {
                name: 'WEATHER_BY_CITY_UP',
                description:
                  'Activates when the temperature goes above a given number in a given city (2 arguments, ex: Hiroshima|4000)',
              },
              {
                name: 'WEATHER_BY_CITY_DOWN',
                description:
                  'Activates when the temperature goes below a given number in a given city (2 arguments, ex: Rennes|30)',
              },
            ],
            reactions: [],
          },
          {
            name: 'one piece',
            actions: [
              {
                name: 'ONE_PIECE_GET_NEW_EP',
                description:
                  'Activates when a new episode is released (no arguments)',
              },
              {
                name: 'ONE_PIECE_GET_NEW_MANGA',
                description:
                  'Activates when a new manga is released (no arguments)',
              },
            ],
            reactions: [],
          },
          {
            name: 'twitter',
            actions: [
              {
                name: 'GET_TWEETS_FROM_USER',
                description:
                  'Activates when a given user posts a tweet (1 argument, ex: pichade05)',
              },
            ],
            reactions: [
              {
                name: 'POST_TWEET_FROM_BOT',
                description:
                  "Posts a tweet from our bot with the given content (1 argument, ex: L'essentiel c'est le plus important et ça c'est le principal)",
              },
              {
                name: 'LIKE_TWEET',
                description:
                  'Likes a tweet with a given tweet id (1 non-user argument, the tweet id comes from a GET_TWEETS_FROM_USER)',
              },
              {
                name: 'RETWEET_TWEET',
                description:
                  'Retweet a tweet with a given tweet id (1 non-user argument, the tweet id comes from a GET_TWEETS_FROM_USER)',
              },
              {
                name: 'COMMENT_TWEET',
                description:
                  'Comment on a tweet with a given tweet id (1 non-user argument, the tweet id comes from a GET_TWEETS_FROM_USER)',
              },
              {
                name: 'SEND_PRIVATE_MESSAGE_TWITTER',
                description:
                  'Send a private message to a given user (2 arguments, ex: artototototo|*explodes your laptop battery*)',
              },
            ],
          },
          {
            name: 'twitch',
            actions: [
              {
                name: 'DETECT_STREAMERS_PLAY_GAMES_TWITCH',
                description:
                  'Returns a list of streamers playing a given game (1 argument, ex: League of Legends)',
              },
              {
                name: 'DETECT_USER_STREAM_GAMES_TWITCH',
                description:
                  'Activates when a given streamer starts playing a given game (2 arguments, ex: pierre1754|Genshin Impact)',
              },
            ],
            reactions: [
              {
                name: 'SEND_WHISPERS_TWITCH',
                description:
                  'Sends a whisper to a given user (2 arguments, ex: nairodtwitch|ratio',
              },
              {
                name: 'BLOCK_USER_TWITCH',
                description:
                  'Block a given user (infinite arguments, ex: arto|artoto|artototo|artotototo|artototototo|artotototototo|...',
              },
              {
                name: 'UNBLOCK_USER_TWITCH',
                description:
                  'Unblock a given user (infinite arguments, ex: arto|artoto|artototo|artotototo|artototototo|artotototototo|...',
              },
            ],
          },
        ],
      },
    };
  }
}
