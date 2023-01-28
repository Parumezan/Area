import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { BaseService } from '../base/base.service';

@Injectable()
export class TwitterService extends BaseService {
  getTwitter(): string {
    return 'twitter';
  }

  @Cron(CronExpression.EVERY_10_SECONDS)
  handleCron() {
    console.log('Twitter called when the current second is 10');
  }
}
