import { Injectable, Inject } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { LinkerService } from '../../linker/linker.service';
import { Cron, CronExpression } from '@nestjs/schedule';
import { BaseService } from '../base/base.service';
import * as OAuth from 'oauth';
import { env } from 'process';
import { Action, ActionType } from '@prisma/client';
import * as Twit from 'twit';

interface TwitterRequestToken {
  oauth_token: string;
  oauth_token_secret: string;
  oauth_callback_confirmed: boolean;
}

interface TwitterAccessToken {
  oauth_token: string;
  oauth_token_secret: string;
  user_id: number;
  screen_name: string;
}

@Injectable()
export class TwitterService extends BaseService {
  constructor(
    @Inject('Prisma') protected readonly prisma: PrismaClient,
    private readonly linkerService: LinkerService,
  ) {
    super(prisma);
  }
  private oAuthClient: OAuth.OAuth = new OAuth.OAuth(
    'https://api.twitter.com/oauth/request_token',
    'https://api.twitter.com/oauth/access_token',
    env.TWITTER_CONSUMER_KEY,
    env.TWITTER_CONSUMER_SECRET,
    '1.0A',
    env.OAUTH2_REDIRECT_URI + '_twitter',
    'HMAC-SHA1',
  );
  @Cron(CronExpression.EVERY_MINUTE)
  handleCron() {
    this.prisma.service
      .findMany({
        where: {
          title: 'Twitter',
        },
        include: {
          action: {
            where: {
              isInput: true,
            },
          },
        },
      })
      .then((services) => {
        const actions = services.flatMap((service) => service.action);
        actions.forEach(async (action: Action) => {
          if (
            (await this.prisma.brick.findFirst({
              where: { id: action.brickId, active: true },
            })) === null
          ) {
            console.log('brick not active');
          } else if (action.isInput === true) {
            switch (action.actionType) {
              case ActionType.GET_TWEETS_FROM_USER:
                this.action_GET_NEW_TWEET_FROM_USER(action);
                break;
            }
          }
        });
      });
  }

  async addTokenToDatabase(token: TwitterAccessToken, userId: number) {
    const service = await this.prisma.service.findMany({
      where: {
        accountId: userId,
        title: 'Twitter',
      },
    });
    if (service.length == 0) {
      await this.prisma.service.create({
        data: {
          title: 'Twitter',
          accountId: userId,
          serviceToken: token.oauth_token,
          serviceTokenSecret: token.oauth_token_secret,
        },
      });
    } else {
      await this.prisma.service.update({
        where: {
          id: service[0].id,
        },
        data: {
          serviceToken: token.oauth_token,
          serviceTokenSecret: token.oauth_token_secret,
        },
      });
    }
  }

  async getTwitterToken() {
    let requestToken: TwitterRequestToken;
    try {
      requestToken = await new Promise((resolve, reject) => {
        this.oAuthClient.getOAuthRequestToken(
          (
            error: any,
            oauth_token: string,
            oauth_token_secret: string,
            oauth_callback_confirmed: boolean,
          ) => {
            if (error) {
              console.log('Error getting OAuth request token : ' + error);
            } else
              resolve({
                oauth_token,
                oauth_token_secret,
                oauth_callback_confirmed,
              });
          },
        );
      });
    } catch (err) {
      console.log(err);
    }
    return requestToken;
  }

  async getTwitterAccessToken(oauth_token: string, oauth_verifier: string) {
    try {
      console.log(oauth_token, oauth_verifier);
      const accessToken: TwitterAccessToken = await new Promise(
        (resolve, reject) => {
          this.oAuthClient.getOAuthAccessToken(
            oauth_token,
            '',
            oauth_verifier,
            (error, oauth_token, oauth_token_secret, results) => {
              if (error) {
                console.log(error);
                reject(error);
              } else
                resolve({
                  oauth_token,
                  oauth_token_secret,
                  user_id: results.user_id,
                  screen_name: results.screen_name,
                });
            },
          );
        },
      );
      return accessToken;
    } catch (err) {
      console.log(err);
    }
  }

  async action_GET_NEW_TWEET_FROM_USER(action: Action) {
    const service = await this.prisma.service.findFirst({
      where: {
        id: action.serviceId,
      },
    });
    const client = new Twit({
      consumer_key: env.TWITTER_CONSUMER_KEY,
      consumer_secret: env.TWITTER_CONSUMER_SECRET,
      access_token: service.serviceToken,
      access_token_secret: service.serviceTokenSecret,
    });
    let tweet = null;
    try {
      tweet = await client.get('statuses/user_timeline', {
        screen_name: action.arguments[0],
        count: 1,
      });
    } catch (err) {
      console.log(err);
      return;
    }
    if (tweet.data.length == 0) return;
    if (action.arguments.length < 2) {
      action.arguments.push(tweet.data[0]?.id_str);
      action.arguments.push(tweet.data[0]?.text);
      await this.prisma.action.update({
        where: {
          id: action.id,
        },
        data: {
          arguments: action.arguments,
        },
      });
    }
    if (action.arguments[1] == tweet.data[0]?.id_str) {
      console.log('no new tweet');
      return;
    }
    await this.prisma.action.update({
      where: {
        id: action.id,
      },
      data: {
        arguments: [
          action.arguments[0],
          tweet.data[0]?.id_str,
          tweet.data[0]?.text,
        ],
      },
    });
    this.linkerService.execAllFromAction(
      action,
      [action.arguments[0], tweet.data[0]?.id_str, tweet.data[0]?.text],
      this.prisma,
    );
    return;
  }

  async action_POST_TWEET(action: Action, prisma: PrismaClient) {
    if (action.arguments.length < 1) return;
    const service = await prisma.service.findFirst({
      where: {
        id: action.serviceId,
      },
    });
    const T = new Twit({
      consumer_key: env.TWITTER_CONSUMER_KEY,
      consumer_secret: env.TWITTER_CONSUMER_SECRET,
      access_token: service.serviceToken,
      access_token_secret: service.serviceTokenSecret,
    });
    const tweetString = action.arguments[0];
    T.post(
      'statuses/update',
      { status: tweetString },
      (err, data, response) => {
        if (err) {
          console.error(err);
        } else {
          console.log(`Successfully tweeted: ${tweetString}`);
        }
      },
    );
    await prisma.action.update({
      where: {
        id: action.id,
      },
      data: {
        actionType: ActionType.NULL,
      },
    });
  }

  async action_LIKE_TWEET(action: Action, prisma: PrismaClient) {
    const service = await prisma.service.findFirst({
      where: {
        id: action.serviceId,
      },
    });
    const T = new Twit({
      consumer_key: env.TWITTER_CONSUMER_KEY,
      consumer_secret: env.TWITTER_CONSUMER_SECRET,
      access_token: service.serviceToken,
      access_token_secret: service.serviceTokenSecret,
    });
    const tweetID = action.arguments[1];
    T.post('favorites/create', { id: tweetID }, (err, data, response) => {
      if (err) {
        console.error(err);
      } else {
        console.log(`Successfully liked tweet: ${tweetID}`);
      }
    });
  }

  async action_RETWEET_TWEET(action: Action, prisma: PrismaClient) {
    const service = await prisma.service.findFirst({
      where: {
        id: action.serviceId,
      },
    });
    const T = new Twit({
      consumer_key: env.TWITTER_CONSUMER_KEY,
      consumer_secret: env.TWITTER_CONSUMER_SECRET,
      access_token: service.serviceToken,
      access_token_secret: service.serviceTokenSecret,
    });
    const tweetID = action.arguments[1];
    T.post('statuses/retweet/:id', { id: tweetID }, (err, data, response) => {
      if (err) {
        console.log(err);
      } else {
        console.log(`Successfully retweeted tweet: ${tweetID}`);
      }
    });
  }

  async action_COMMENT_TWEET(action: Action, prisma: PrismaClient) {
    const service = await prisma.service.findFirst({
      where: {
        id: action.serviceId,
      },
    });
    const T = new Twit({
      consumer_key: env.TWITTER_CONSUMER_KEY,
      consumer_secret: env.TWITTER_CONSUMER_SECRET,
      access_token: service.serviceToken,
      access_token_secret: service.serviceTokenSecret,
    });
    const tweetID = action.arguments[2];
    const comment = '@' + action.arguments[1] + ' ' + action.arguments[0];
    T.post(
      'statuses/update',
      { in_reply_to_status_id: tweetID, status: comment },
      (err, data, response) => {
        if (err) {
          console.log(err);
        } else {
          console.log(`Successfully commented on tweet: ${tweetID}`);
        }
      },
    );
  }

  async getIdByUsername(username: string, T: Twit) {
    return await T.get('users/lookup', { screen_name: username });
  }

  async action_SEND_PRIVATE_MESSAGE(action: Action, prisma: PrismaClient) {
    const service = await prisma.service.findFirst({
      where: {
        id: action.serviceId,
      },
    });
    const T: Twit = await new Twit({
      consumer_key: env.TWITTER_CONSUMER_KEY,
      consumer_secret: env.TWITTER_CONSUMER_SECRET,
      access_token: service.serviceToken,
      access_token_secret: service.serviceTokenSecret,
    });
    if (/^\d+$/.test(action.arguments[0]) == false) {
      const recipient = await this.getIdByUsername(action.arguments[0], T).then(
        (res) => {
          return res?.data[0]?.id_str;
        },
      );
      if (recipient == undefined) return;
      action.arguments[0] = recipient;
      await prisma.action.update({
        where: {
          id: action.id,
        },
        data: {
          arguments: action.arguments,
        },
      });
    }
    await T.post(
      'direct_messages/events/new',
      {
        event: {
          type: 'message_create',
          message_create: {
            target: {
              recipient_id: action.arguments[0],
            },
            message_data: {
              text: action.arguments[1],
            },
          },
        },
      },
      (err, data, response) => {
        if (err) {
          console.error(err);
          return null;
        } else {
          console.log(
            `Successfully sent private message to ${action.arguments[0]}`,
          );
          return action.arguments[0];
        }
      },
    );
  }
}
