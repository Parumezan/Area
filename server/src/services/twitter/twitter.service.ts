import { Injectable, Req } from '@nestjs/common';
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
  private oAuthClient: OAuth.OAuth = new OAuth.OAuth(
    'https://api.twitter.com/oauth/request_token',
    'https://api.twitter.com/oauth/access_token',
    env.TWITTER_CONSUMER_KEY,
    env.TWITTER_CONSUMER_SECRET,
    '1.0A',
    env.TWITTER_CALLBACK_URL,
    'HMAC-SHA1',
  );

  @Cron(CronExpression.EVERY_10_SECONDS)
  handleCron() {
    this.prisma.action
      .findMany({
        where: {
          serviceId: 2,
        },
      })
      .then((actions: Action[]) => {
        actions.forEach((action: Action) => {
          if (action.isInput === true)
            switch (action.actionType) {
              case ActionType.GET_TWEETS_FROM_USER:
                this.action_GET_TWEETS_FROM_USER(action);
                break;
              case ActionType.POST_TWEET_FROM_BOT:
                this.action_POST_TWEET(action);
                break;
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
    var requestToken: TwitterRequestToken;
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
              console.log(error);
              reject(error);
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
      throw new Error('Error getting twitter token');
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
      console.log(accessToken);
      return accessToken;
    } catch (err) {
      throw new Error('Error getting twitter access token');
    }
  }

  async action_GET_TWEETS_FROM_USER(action: Action) {
    const service = await this.prisma.service.findFirst({
      where: {
        id: action.serviceId,
      },
    });
    const client = new Twit({
      appKey: env.TWITTER_CONSUMER_KEY,
      appSecret: env.TWITTER_CONSUMER_SECRET,
      accessToken: service.serviceToken,
      accessSecret: service.serviceTokenSecret,
    });
    const tweet = await client.v1.get('statuses/user_timeline', {
      screen_name: action.arguments[0],
      count: 1,
    });
    return tweet;
  }

  async action_POST_TWEET(action: Action) {
    const service = await this.prisma.service.findFirst({
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
  }

  async action_LIKE_TWEET(action: Action) {
    const service = await this.prisma.service.findFirst({
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
    const tweetID = action.arguments[0];
    T.post('favorites/create', { id: tweetID }, (err, data, response) => {
      if (err) {
        console.error(err);
      } else {
        console.log(`Successfully liked tweet: ${tweetID}`);
      }
    });
  }

  async action_RETWEET_TWEET(action: Action) {
    const service = await this.prisma.service.findFirst({
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
    const tweetID = action.arguments[0];
    T.post('statuses/retweet/:id', { id: tweetID }, (err, data, response) => {
      if (err) {
        console.error(err);
      } else {
        console.log(`Successfully retweeted tweet: ${tweetID}`);
      }
    });
  }

  async action_COMMENT_TWEET(action: Action) {
    const service = await this.prisma.service.findFirst({
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
    const tweetID = action.arguments[0];
    const comment = action.arguments[1];
    T.post(
      'statuses/update',
      { status: comment, in_reply_to_status_id: tweetID },
      (err, data, response) => {
        if (err) {
          console.error(err);
        } else {
          console.log(`Successfully commented on tweet: ${tweetID}`);
        }
      },
    );
  }
}
