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
          serviceId: 1,
        },
      })
      .then((actions: Action[]) => {
        actions.forEach((action: Action) => {
          if (action.isInput === true)
            switch (action.actionType) {
              case ActionType.TIME_IS_X:
                this.action_TIME_IS_X(action);
                break;
            }
        });
      });
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

  async action_TIME_IS_X(action: Action) {
    if (action.arguments.length === 0) return;
    const time = action.arguments[0];

    fetch('http://worldtimeapi.org/api/timezone/Europe/Paris')
      .then((response) => response.json())
      .then((data) => {
        const hour_action = parseInt(time.split(':')[0]);
        const minute_action = parseInt(time.split(':')[1]);
        const hour_now = parseInt(data.datetime.slice(11, 13));
        const minute_now = parseInt(data.datetime.slice(14, 16));
        const second_now = parseInt(data.datetime.slice(17, 19));
        if (
          hour_action === hour_now &&
          minute_action === minute_now &&
          second_now === 0
        ) {
          this.execAllFromAction(action);
        }
      });
  }
}
