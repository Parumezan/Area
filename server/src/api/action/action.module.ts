import { Module } from '@nestjs/common';
import { ActionService } from './action.service';
import { ActionController } from './action.controller';
import { PrismaProvider } from '../../prisma';

@Module({
  controllers: [ActionController],
  providers: [ActionService, PrismaProvider],
})
export class ActionModule {}
