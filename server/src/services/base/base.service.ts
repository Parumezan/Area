import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class BaseService {
  @Cron(CronExpression.EVERY_10_SECONDS)
  handleCron() {
    console.log('Called when the current second is 10');
  }
}
