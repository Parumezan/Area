import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ClockService } from './clock.service';

@Controller('clock')
export class ClockController {
  constructor(private readonly clockService: ClockService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get()
  getClock(): string {
    return this.clockService.getClock();
  }
}
