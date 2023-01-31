import {
  Controller,
  UseGuards,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Req,
} from '@nestjs/common';
import { BrickService } from './brick.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiBody } from '@nestjs/swagger';
import { CreateBrickDto } from './dto/create-brick.dto';
import { UpdateBrickDto } from './dto/update-brick.dto';

@Controller('api/brick')
export class BrickController {
  constructor(private readonly brickService: BrickService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get()
  readAllBricks(@Req() req: any) {
    return this.brickService.readAllBricks(req.user.id);
  }

  @ApiBody({
    type: CreateBrickDto,
    required: true,
    description: 'Create brick',
    examples: {
      brick: {
        value: {
          title: 'This is a title',
          description: 'This is a description',
          published: true,
        },
      },
    },
  })
  @UseGuards(AuthGuard('jwt'))
  @Post()
  createBrick(@Req() req: any, @Body() body: CreateBrickDto) {
    return this.brickService.createBrick(req.user.id, body);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  readBrick(@Req() req: any, @Param('id') id: number) {
    return this.brickService.readBrick(req.user.id, id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  updateBrick(
    @Req() req: any,
    @Param('id') id: number,
    @Body() body: UpdateBrickDto,
  ) {
    return this.brickService.updateBrick(req.user.id, id, body);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  deleteBrick(@Req() req: any, @Param('id') id: number) {
    return this.brickService.deleteBrick(req.user.id, id);
  }
}
