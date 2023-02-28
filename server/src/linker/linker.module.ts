import { Module } from '@nestjs/common';
import { LinkerService } from './linker.service';
import { TwitterService } from 'src/services/twitter/twitter.service';
import { PrismaProvider } from 'src/prisma';
import { TwitchService } from 'src/services/twitch/twitch.service';

@Module({
  providers: [LinkerService, TwitterService, TwitchService, PrismaProvider],
})
export class LinkerModule {}
