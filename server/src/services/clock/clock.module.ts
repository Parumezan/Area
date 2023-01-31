import { Module } from '@nestjs/common';
import { ClockController } from './clock.controller';
import { ClockService } from './clock.service';
import { PrismaProvider } from '../../prisma';

@Module({
  controllers: [ClockController],
  providers: [ClockService, PrismaProvider],
})
export class ClockModule {}
