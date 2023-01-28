import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { BaseService } from '../base/base.service';
import { Action, ActionType } from '@prisma/client';

@Injectable()
export class ClockService extends BaseService {
  getClock(): string {
    return 'clock';
  }

  @Cron(CronExpression.EVERY_10_SECONDS)
  handleCron() {
    this.prisma.action
      .findMany({
        where: {
          serviceId: 0,
        },
      })
      .then((actions: Action[]) => {
        actions.forEach((action: Action) => {
          if (action.isInput === true)
            switch (action.actionType) {
              case ActionType.EVEN_MINUTE:
                if (new Date().getMinutes() % 2 === 0) {
                  console.log('trigger action');
                  // get brick, and trigger all output actions
                }
                break;
            }
        });
      });
  }
}
