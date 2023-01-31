import { Module } from '@nestjs/common';
import { TwitterController } from './twitter.controller';
import { TwitterService } from './twitter.service';
import { PrismaProvider } from '../../prisma';

@Module({
  controllers: [TwitterController],
  providers: [TwitterService, PrismaProvider],
})
export class TwitterModule {}
