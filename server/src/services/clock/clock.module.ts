import { Module } from '@nestjs/common';
import { ClockController } from './clock.controller';
import { ClockService } from './clock.service';
import { PrismaProvider } from '../../prisma';
import { LinkerService } from 'src/linker/linker.service';

@Module({
  controllers: [ClockController],
  providers: [ClockService, LinkerService, PrismaProvider],
})
export class ClockModule {}
