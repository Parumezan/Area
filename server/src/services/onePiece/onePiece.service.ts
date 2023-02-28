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
        actions.forEach((action: Action) => {
          if (action.isInput === true) {
            switch (action.actionType) {
              case ActionType.ONE_PIECE_GET_NEW_EP:
                this.action_ONE_PIECE_GET_NEW_EP(action);
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
    if (response.status === 200) return;
    if (action.arguments.length == 0) {
      this.prisma.action.update({
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
      'https://api.api-onepiece.com/episodes/' + response.data,
    );
    if (info.status === 200) {
      this.prisma.action.update({
        where: {
          id: action.id,
        },
        data: {
          arguments: [response.data.episode],
        },
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
}
