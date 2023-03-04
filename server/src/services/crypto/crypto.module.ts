import { Module } from '@nestjs/common';
import { PrismaProvider } from 'src/prisma';
import { CryptoController } from './crypto.controller';
import { CryptoService } from './crypto.service';
import { LinkerService } from 'src/linker/linker.service';

@Module({
  controllers: [CryptoController],
  providers: [CryptoService, PrismaProvider, LinkerService],
})
export class CryptoModule {}
