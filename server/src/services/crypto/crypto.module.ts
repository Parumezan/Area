import { Module } from '@nestjs/common';
import { PrismaProvider } from 'src/prisma';
import { CryptoController } from './crypto.controller';
import { CryptoService } from './crypto.service';
import { LinkerService } from 'src/linker/linker.service';
import { TwitterService } from 'src/services/twitter/twitter.service';
import { TwitchService } from '../twitch/twitch.service';

@Module({
  controllers: [CryptoController],
  providers: [
    CryptoService,
    PrismaProvider,
    LinkerService,
    TwitterService,
    TwitchService,
  ],
})
export class CryptoModule {}
