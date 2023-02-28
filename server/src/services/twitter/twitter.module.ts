import { Module } from '@nestjs/common';
import { TwitterController } from './twitter.controller';
import { TwitterService } from './twitter.service';
import { PrismaProvider } from '../../prisma';
import { LinkerService } from 'src/linker/linker.service';
import { TwitchService } from '../twitch/twitch.service';

@Module({
  controllers: [TwitterController],
  providers: [TwitterService, PrismaProvider, LinkerService, TwitchService],
})
export class TwitterModule {}
