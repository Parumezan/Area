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
                desctipion: 'Activates when the time is X (ex: 12:00)',
              },
              {
                name: 'DAY_IS_X_TIME_IS_Y',
                desctipion:
                  'Activates when the day is X and the time is Y (ex: Monday, 12:00)',
              },
            ],
            reactions: [],
          },
          {
            name: 'crypto',
            actions: [
              {
                name: 'CRYPTO_CHECK_PRICE',
                desctipion:
                  'Activates when the value exceed the given amount (ex: BTC/ETH 120)',
              },
            ],
            reactions: [],
          },
          {
            name: 'weather',
            actions: [
              {
                name: 'WEATHER_BY_CITY',
                desctipion:
                  'Activates when the weather changes in a given city (ex: Paris)',
              },
            ],
            reactions: [],
          },
          {
            name: 'one piece',
            actions: [
              {
                name: 'ONE_PIECE_GET_NEW_EP',
                desctipion: 'Activates when a new episode is released',
              },
            ],
            reactions: [],
          },
          {
            name: 'twitter',
            actions: [
              {
                name: 'GET_TWEETS_FROM_USER',
                desctipion: 'Activates when a user posts a tweet',
              },
            ],
            reactions: [
              {
                name: 'POST_TWEET_FROM_BOT',
                desctipion: 'Posts a tweet with the given content',
              },
              {
                name: 'LIKE_TWEET',
                desctipion: 'Likes a tweet for a given tweet id',
              },
              {
                name: 'RETWEET_TWEET',
                desctipion: 'Retweets a tweet for a given tweet id',
              },
              {
                name: 'COMMENT_TWEET',
                desctipion: 'Comments a tweet for a given tweet id',
              },
            ],
          },
          {
            name: 'twitch',
            actions: [
              {
                name: 'DETECT_STREAMERS_PLAY_GAMES_TWITCH',
                desctipion:
                  'Returns a list of streamers playing a given game (ex: Pokemon Emerald)',
              },
              {
                name: 'DETECT_USER_STREAM_GAMES_TWITCH',
                desctipion:
                  'Activates when a streamer starts playing a given game (ex: username, League of Legends)',
              },
            ],
            reactions: [
              {
                name: 'SEND_WHISPERS_TWITCH',
                desctipion: 'Sends a whisper to a given user',
              },
              {
                name: 'BLOCK_USER_TWITCH',
                desctipion: 'Sends a whisper to a given user id',
              },
              {
                name: 'UNBLOCK_USER_TWITCH',
                desctipion: 'Sends a whisper to a given user id',
              },
            ],
          },
        ],
      },
    };
  }
}
