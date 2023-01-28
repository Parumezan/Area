import {
  Controller,
  UseGuards,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Req,
} from '@nestjs/common';
import { BrickService } from './brick.service';
import { Brick } from '@prisma/client';
import { AuthGuard } from '@nestjs/passport';

@Controller('api/brick')
export class BrickController {
  constructor(private readonly brickService: BrickService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get()
  readAllBricks(@Req() req: any) {
    return this.brickService.readAllBricks(req.user.id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  createBrick(@Req() req: any, @Body() body: Brick) {
    return this.brickService.createBrick(req.user.id, body);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  readBrick(@Req() req: any, @Param('id') id: number) {
    return this.brickService.readBrick(req.user.id, id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  updateBrick(@Req() req: any, @Param('id') id: number, @Body() body: Brick) {
    return this.brickService.updateBrick(req.user.id, id, body);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  deleteBrick(@Req() req: any, @Param('id') id: number) {
    return this.brickService.deleteBrick(req.user.id, id);
  }
}
