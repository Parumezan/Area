import { Module } from '@nestjs/common';
import { ServiceService } from './service.service';
import { ServiceController } from './service.controller';
import { PrismaProvider } from '../../prisma';

@Module({
  controllers: [ServiceController],
  providers: [ServiceService, PrismaProvider],
})
export class ServiceModule {}
