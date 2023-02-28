import { Injectable } from '@nestjs/common';
import { Action, ActionType, PrismaClient } from '@prisma/client';
import { TwitterService } from 'src/services/twitter/twitter.service';
import { TwitchService } from 'src/services/twitch/twitch.service';

@Injectable()
export class LinkerService {
  constructor(
    private twitterService: TwitterService,
    private twitchService: TwitchService,
  ) {}
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
                    action.arguments = listArg;
                    this.twitterService.action_POST_TWEET(action);
                    break;
                  case ActionType.SEND_WHISPERS_TWITCH:
                    action.arguments = listArg;
                    this.twitchService.action_SEND_MESSAGE(action);
                }
            });
          });
      });
  }
}
