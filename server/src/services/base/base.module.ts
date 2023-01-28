import { Module } from '@nestjs/common';
import { BaseService } from './base.service';
import { PrismaProvider } from '../../prisma';

@Module({
  providers: [BaseService, PrismaProvider],
})
export class BaseModule {}
