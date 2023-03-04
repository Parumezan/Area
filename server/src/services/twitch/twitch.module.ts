import { Module } from '@nestjs/common';
import { TwitchController } from './twitch.controller';
import { TwitchService } from './twitch.service';
import { PrismaProvider } from '../../prisma';
import { LinkerService } from 'src/linker/linker.service';

@Module({
  controllers: [TwitchController],
  providers: [TwitchService, PrismaProvider, LinkerService],
})
export class TwitchModule {}
