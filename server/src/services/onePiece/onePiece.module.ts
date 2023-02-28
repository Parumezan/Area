import { Module } from '@nestjs/common';
import { PrismaProvider } from '../../prisma';
import { LinkerService } from 'src/linker/linker.service';
import { TwitterService } from '../twitter/twitter.service';
import { OnePieceController } from './onePiece.controller';
import { OnePieceService } from './onePiece.service';
import { TwitchService } from '../twitch/twitch.service';

@Module({
  controllers: [OnePieceController],
  providers: [
    OnePieceService,
    PrismaProvider,
    LinkerService,
    TwitterService,
    TwitchService,
  ],
})
export class onePieceModule {}
