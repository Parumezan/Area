import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { BaseService } from '../base/base.service';

@Injectable()
export class ClockService extends BaseService {
  getClock(): string {
    return 'clock';
  }

  @Cron(CronExpression.EVERY_10_SECONDS)
  handleCron() {
    console.log('Clock called when the current second is 10');
  }
}
