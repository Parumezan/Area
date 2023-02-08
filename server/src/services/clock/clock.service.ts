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
              case ActionType.DAY_IS_X_TIME_IS_Y:
                this.action_DAY_IS_X_TIME_IS_Y(action);
                break;
            }
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

  async action_DAY_IS_X_TIME_IS_Y(action: Action) {
    if (action.arguments.length === 0) return;
    const day: string = action.arguments[0];
    const time = action.arguments[1];

    fetch('http://worldtimeapi.org/api/timezone/Europe/Paris')
      .then((response) => response.json())
      .then((data) => {
        const hour_action = parseInt(time.split(':')[0]);
        const minute_action = parseInt(time.split(':')[1]);
        const hour_now = parseInt(data.datetime.slice(11, 13));
        const minute_now = parseInt(data.datetime.slice(14, 16));
        const second_now = parseInt(data.datetime.slice(17, 19));
        const day_now = new Date(data.datetime).getUTCDay();
        const days = [
          'Sunday',
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday',
        ];
        if (
          hour_action === hour_now &&
          minute_action === minute_now &&
          second_now === 0 &&
          days[day_now] === day
        ) {
          this.execAllFromAction(action);
        }
      });
  }
}
