import { Injectable, Inject, HttpException } from '@nestjs/common';
import { Action, PrismaClient } from '@prisma/client';
import { CreateActionDto } from './dto/create-action.dto';
import { UpdateActionDto } from './dto/update-action.dto';

@Injectable()
export class ActionService {
  constructor(@Inject('Prisma') private readonly prisma: PrismaClient) {}

  async readAllActions(accountId: number): Promise<Action[]> {
    const brick = await this.prisma.brick.findMany({
      where: { accountId: accountId },
    });
    if (!brick) {
      console.log('No brick found');
      return [];
    }
    return this.prisma.action.findMany({
      where: {
        brickId: {
          in: brick.map((b) => b.id),
        },
      },
    });
  }

  async readActionsFromBrick(
    accountId: number,
    brickId: number,
  ): Promise<Action[]> {
    const brick = await this.prisma.brick.findUnique({
      where: { id: brickId },
    });
    if (!brick) {
      console.log('No brick found');
      return [];
    }
    if (brick.accountId !== accountId) {
      console.log('Forbidden');
      return [];
    }
    return this.prisma.action.findMany({
      where: {
        brickId: brickId,
      },
    });
  }

  async createAction(
    accountId: number,
    action: CreateActionDto,
  ): Promise<Action> {
    const brick = await this.prisma.brick.findUnique({
      where: { id: action.brickId },
    });
    let service = await this.prisma.service.findFirst({
      where: { accountId: accountId, title: action.serviceName },
    });
    let newArgs = [];
    if (service === null)
      service = await this.prisma.service.findFirst({
        where: { accountId: -1, title: action.serviceName },
      });
    if (!brick) {
      console.log('No brick found');
      return;
    }
    if (brick.accountId !== accountId) {
      console.log('Forbidden');
      return;
    }
    if (action.arguments.length !== 0)
      newArgs = action.arguments[0].split('|').map((arg) => arg.trim());
    return this.prisma.action.create({
      data: {
        description: action.description,
        brickId: action.brickId,
        serviceId: service.id,
        arguments: newArgs,
        isInput: action.isInput,
        actionType: action.actionType,
      },
    });
  }

  async readAction(accountId: number, id: number): Promise<Action> {
    const action = await this.prisma.action.findUnique({
      where: { id: id },
    });
    if (!action) {
      console.log('No action found');
      return;
    }
    const brick = await this.prisma.brick.findUnique({
      where: { id: action.brickId },
    });
    if (!brick) {
      console.log('No brick found');
      return;
    }
    if (brick.accountId !== accountId) {
      console.log('Forbidden');
      return;
    }
    return action;
  }

  async updateAction(
    accountId: number,
    id: number,
    data: UpdateActionDto,
  ): Promise<Action> {
    const action = await this.prisma.action.findUnique({
      where: { id: id },
    });
    if (!action) {
      console.log('No action found');
      return;
    }
    let service = await this.prisma.service.findFirst({
      where: { accountId: accountId, title: data.serviceName },
    });

    if (service === null)
      service = await this.prisma.service.findFirst({
        where: { accountId: -1, title: data.serviceName },
      });
    const brick = await this.prisma.brick.findUnique({
      where: { id: action.brickId },
    });
    if (!brick) {
      console.log('No brick found');
      return;
    }
    if (brick.accountId !== accountId) {
      console.log('Forbidden');
      return;
    }
    delete data.serviceName;
    if (data.arguments.length !== 0)
      data.arguments = data.arguments[0].split('|').map((arg) => arg.trim());
    return this.prisma.action.update({
      where: { id: id },
      data: { ...data, serviceId: service.id },
    });
  }

  async deleteAction(accountId: number, id: number): Promise<Action> {
    const action = await this.prisma.action.findUnique({
      where: { id: id },
    });
    if (!action) {
      console.log('No action found');
      return;
    }
    const brick = await this.prisma.brick.findUnique({
      where: { id: action.brickId },
    });
    if (!brick) {
      console.log('No brick found');
      return;
    }
    if (brick.accountId !== accountId) {
      console.log('Forbidden');
      return;
    }
    return this.prisma.action.delete({ where: { id: id } });
  }

  getActionTypes() {
    return [
      {
        service: 'Time',
        isInput: true,
        type: 'TIME_IS_X',
        description: 'Activates when the given time is reached. 1 argument',
      },
      {
        service: 'Time',
        isInput: true,
        type: 'DAY_IS_X_TIME_IS_Y',
        description:
          'Activates when the given day and time is reached. 2 arguments',
      },
      {
        service: 'Crypto',
        isInput: true,
        type: 'CRYPTO_CHECK_PRICE',
        description:
          'Activates when the given crypto price is reached. 2 arguments',
      },
      {
        service: 'OnePiece',
        isInput: true,
        type: 'ONE_PIECE_GET_NEW_EP',
        description:
          'Activates when a new One Piece episode is released. 0 arguments',
      },
      {
        service: 'Twitch',
        isInput: true,
        type: 'DETECT_STREAMERS_PLAY_GAMES_TWITCH',
        description:
          'Activates when the given streamers are playing the given games. 2 arguments',
      },
      {
        service: 'Twitch',
        isInput: true,
        type: 'DETECT_USER_STREAM_GAMES_TWITCH',
        description:
          'Activates when the given user is streaming the given game. 2 arguments',
      },
      {
        service: 'Twitter',
        isInput: true,
        type: 'GET_TWEETS_FROM_USER',
        description: 'Activates when the given user tweets. 1 argument',
      },
      {
        service: 'Weather',
        isInput: true,
        type: 'WEATHER_BY_CITY',
        description:
          'Activates when the weather in the given city is the given weather. 2 arguments',
      },
      {
        service: 'Twitch',
        isInput: false,
        type: 'SEND_WHISPERS_TWITCH',
        description: 'Sends a whisper to the given user. 2 arguments',
      },
      {
        service: 'Twitch',
        isInput: false,
        type: 'BLOCK_USER_TWITCH',
        description: 'Blocks the given user. 1 argument',
      },
      {
        service: 'Twitch',
        isInput: false,
        type: 'UNBLOCK_USER_TWITCH',
        description: 'Unblocks the given user. 1 argument',
      },
      {
        service: 'Twitter',
        isInput: false,
        type: 'POST_TWEET_FROM_BOT',
        description: 'Posts a tweet from the bot. 1 argument',
      },
      {
        service: 'Twitter',
        isInput: false,
        type: 'LIKE_TWEET',
        description: 'Likes the given tweet. 1 argument',
      },
      {
        service: 'Twitter',
        isInput: false,
        type: 'RETWEET_TWEET',
        description: 'Retweets the given tweet. 1 argument',
      },
      {
        service: 'Twitter',
        isInput: false,
        type: 'COMMENT_TWEET',
        description: 'Comments the given tweet. 2 arguments',
      },
    ];
  }
}
