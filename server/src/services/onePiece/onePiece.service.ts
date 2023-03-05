import { Injectable, Inject } from '@nestjs/common';
import { BaseService } from '../base/base.service';
import { PrismaClient } from '@prisma/client';
import { LinkerService } from 'src/linker/linker.service';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Action, ActionType } from '@prisma/client';
import axios from 'axios';

@Injectable()
export class OnePieceService extends BaseService {
  constructor(
    @Inject('Prisma') protected readonly prisma: PrismaClient,
    private readonly linkerService: LinkerService,
  ) {
    super(prisma);
  }
  @Cron(CronExpression.EVERY_10_MINUTES)
  handleCron() {
    this.prisma.action
      .findMany({
        where: {
          service: {
            title: 'OnePiece',
          },
        },
      })
      .then((actions: Action[]) => {
        actions.forEach(async (action: Action) => {
          if (
            (await this.prisma.brick.findFirst({
              where: { id: action.brickId, active: true },
            })) === null
          ) {
            console.log('brick not active');
          } else if (action.isInput === true) {
            switch (action.actionType) {
              case ActionType.ONE_PIECE_GET_NEW_EP:
                this.action_ONE_PIECE_GET_NEW_EP(action);
                break;
              case ActionType.ONE_PIECE_GET_NEW_MANGA:
                this.action_ONE_PIECE_GET_NEW_MANGA(action);
                break;
            }
          }
        });
      });
  }

  async action_ONE_PIECE_GET_NEW_EP(action: Action) {
    const response = await axios.get(
      'https://api.api-onepiece.com/episodes/count',
    );
    if (response.status !== 200) return;
    if (action.arguments.length == 0) {
      await this.prisma.action.update({
        where: { id: action.id },
        data: { arguments: [response.data.toString()] },
      });
      return;
    } else if (action.arguments[0] == response.data) return;
    const info = await axios.get(
      'https://api.api-onepiece.com/episodes/' + response.data,
    );
    if (info.status !== 200) {
      await this.prisma.action.update({
        where: { id: action.id },
        data: { arguments: [response.data.episode] },
      });
      this.linkerService.execAllFromAction(
        action,
        [
          `Le dernier épisode de One Piece vient de sortir, c'est le ${info.data.episode} intitulé ${info.data.title}.`,
        ],
        this.prisma,
      );
    }
    return;
  }

  async action_ONE_PIECE_GET_NEW_MANGA(action: Action) {
    const response = await axios.get(
      'https://api.api-onepiece.com/tomes/count',
    );
    if (response.status !== 200) return;
    if (action.arguments.length == 0) {
      await this.prisma.action.update({
        where: {
          id: action.id,
        },
        data: {
          arguments: [response.data],
        },
      });
      return;
    } else if (action.arguments[0] == response.data) return;
    const info = await axios.get(
      'https://api.api-onepiece.com/tomes/' + response.data,
    );
    if (info.status === 200) {
      await this.prisma.action.update({
        where: {
          id: action.id,
        },
        data: {
          arguments: [response.data.toString()],
        },
      });
      this.linkerService.execAllFromAction(
        action,
        [
          `Le dernier tome de One Piece vient de sortir, c'est le ${info.data.episode} intitulé ${info.data.title}.`,
        ],
        this.prisma,
      );
    }
    return;
  }
}
