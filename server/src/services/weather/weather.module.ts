import { Module } from '@nestjs/common';
import { WeatherController } from './weather.controller';
import { WeatherService } from './weather.service';
import { PrismaProvider } from '../../prisma';
import { LinkerService } from 'src/linker/linker.service';

@Module({
  controllers: [WeatherController],
  providers: [WeatherService, PrismaProvider, LinkerService],
})
export class WeatherModule {}
