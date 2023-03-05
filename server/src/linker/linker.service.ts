import { Injectable } from '@nestjs/common';
import { Action, ActionType, PrismaClient } from '@prisma/client';
import { TwitterService } from '../services/twitter/twitter.service';
import { TwitchService } from '../services/twitch/twitch.service';

@Injectable()
export class LinkerService {
  execAllFromAction(action: Action, listArg: string[], prisma: PrismaClient) {
    prisma.brick
      .findUnique({
        where: {
          id: action.brickId,
        },
      })
      .then((brick) => {
        prisma.action
          .findMany({
            where: {
              brickId: brick.id,
              isInput: false,
            },
          })
          .then((actions) => {
            actions.forEach((action) => {
              if (action.isInput === false)
                switch (action.actionType) {
                  case ActionType.POST_TWEET_FROM_BOT:
                    listArg.forEach((arg) => {
                      action.arguments.push(arg);
                    });
                    TwitterService.prototype.action_POST_TWEET(action, prisma);
                    break;
                  case ActionType.COMMENT_TWEET:
                    listArg.forEach((arg) => {
                      action.arguments.push(arg);
                    });
                    TwitterService.prototype.action_COMMENT_TWEET(
                      action,
                      prisma,
                    );
                    break;
                  case ActionType.RETWEET_TWEET:
                    listArg.forEach((arg) => {
                      action.arguments.push(arg);
                    });
                    TwitterService.prototype.action_RETWEET_TWEET(
                      action,
                      prisma,
                    );
                    break;
                  case ActionType.LIKE_TWEET:
                    listArg.forEach((arg) => {
                      action.arguments.push(arg);
                    });
                    TwitterService.prototype.action_LIKE_TWEET(action, prisma);
                    break;
                  case ActionType.SEND_PRIVATE_MESSAGE_TWITTER:
                    listArg.forEach((arg) => {
                      action.arguments.push(arg);
                    });
                    TwitterService.prototype.action_SEND_PRIVATE_MESSAGE(
                      action,
                      prisma,
                    );
                    break;
                  case ActionType.SEND_WHISPERS_TWITCH:
                    listArg.forEach((arg) => {
                      action.arguments.push(arg);
                    });
                    TwitchService.prototype.action_SEND_MESSAGE(action, prisma);
                    break;
                  case ActionType.BLOCK_USER_TWITCH:
                    listArg.forEach((arg) => {
                      action.arguments.push(arg);
                    });
                    TwitchService.prototype.action_BLOCK_USER(action, prisma);
                    break;
                  case ActionType.UNBLOCK_USER_TWITCH:
                    listArg.forEach((arg) => {
                      action.arguments.push(arg);
                    });
                    TwitchService.prototype.action_UNBLOCK_USER(action, prisma);
                    break;
                }
            });
          });
      });
  }
}
