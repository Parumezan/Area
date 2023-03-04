import { Module } from '@nestjs/common';
import { LinkerService } from './linker.service';
import { PrismaProvider } from 'src/prisma';

@Module({
  providers: [LinkerService, PrismaProvider],
})
export class LinkerModule {}
