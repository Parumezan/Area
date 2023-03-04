import { Injectable, Inject } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class BaseService {
  constructor(@Inject('Prisma') protected readonly prisma: PrismaClient) {}

  @Cron(CronExpression.EVERY_10_SECONDS)
  handleCron() {
    console.log('Called when the current second is 10');
  }
}
