import { Module } from '@nestjs/common';
import { BrickService } from './brick.service';
import { BrickController } from './brick.controller';
import { PrismaProvider } from '../../prisma';

@Module({
  controllers: [BrickController],
  providers: [BrickService, PrismaProvider],
})
export class BrickModule {}
