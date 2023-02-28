import { Controller } from '@nestjs/common';
import { OnePieceService } from './onePiece.service';

@Controller('onePiece')
export class OnePieceController {
  constructor(private readonly onePieceService: OnePieceService) {}
}
