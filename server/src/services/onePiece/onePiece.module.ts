import { Module } from '@nestjs/common';
import { PrismaProvider } from '../../prisma';
import { LinkerService } from 'src/linker/linker.service';
import { OnePieceController } from './onePiece.controller';
import { OnePieceService } from './onePiece.service';

@Module({
  controllers: [OnePieceController],
  providers: [OnePieceService, PrismaProvider, LinkerService],
})
export class onePieceModule {}
