import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ClockService } from './clock.service';

@ApiTags('Clock')
@Controller('clock')
export class ClockController {
  constructor(private readonly clockService: ClockService) {}
}
