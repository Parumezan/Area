import { Module } from '@nestjs/common';
import { WeatherController } from './weather.controller';
import { WeatherService } from './weather.service';
import { PrismaProvider } from '../../prisma';
import { LinkerService } from 'src/linker/linker.service';
import { TwitterService } from '../twitter/twitter.service';
import { TwitchService } from '../twitch/twitch.service';

@Module({
  controllers: [WeatherController],
  providers: [
    WeatherService,
    PrismaProvider,
    LinkerService,
    TwitterService,
    TwitchService,
  ],
})
export class WeatherModule {}
