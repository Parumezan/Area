import { Module } from '@nestjs/common';
import { TwitchController } from './twitch.controller';
import { TwitchService } from './twitch.service';
import { PrismaProvider } from '../../prisma';

@Module({
  controllers: [TwitchController],
  providers: [TwitchService, PrismaProvider],
})
export class TwitchModule {}
