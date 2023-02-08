import { Injectable, Inject } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Action, PrismaClient } from '@prisma/client';

@Injectable()
export class BaseService {
  constructor(@Inject('Prisma') protected readonly prisma: PrismaClient) {}

  @Cron(CronExpression.EVERY_10_SECONDS)
  handleCron() {
    console.log('Called when the current second is 10');
  }

  execAllFromAction(action: Action) {
    this.prisma.brick
      .findUnique({
        where: {
          id: action.brickId,
        },
      })
      .then((brick) => {
        this.prisma.action
          .findMany({
            where: {
              brickId: brick.id,
              isInput: false,
            },
          })
          .then((actions) => {
            actions.forEach((action) => {
              if (action.isInput === false)
                console.log('trigger action', action.description);
            });
          });
      });
  }
}
