import { Module } from '@nestjs/common';
import { GmailController } from './gmail.controller';
import { GmailService } from './gmail.service';
import { PrismaProvider } from '../../prisma';

@Module({
  controllers: [GmailController],
  providers: [GmailService, PrismaProvider],
})
export class GmailModule {}
