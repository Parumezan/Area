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
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateBrickDto } from './dto/create-brick.dto';
import { UpdateBrickDto } from './dto/update-brick.dto';

@ApiTags('Brick')
@Controller('api/brick')
export class BrickController {
  constructor(private readonly brickService: BrickService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get()
  @ApiOperation({
    summary: "Get all user's bricks",
    description: "Returns an array of all user's bricks.",
  })
  @ApiBearerAuth()
  @ApiResponse({ type: UpdateBrickDto, isArray: true })
  readAllBricks(@Req() req: any) {
    return this.brickService.readAllBricks(req.user.id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  @ApiOperation({
    summary: 'Create a brick',
    description: 'Creates a brick and returns it.',
  })
  @ApiBearerAuth()
  @ApiBody({
    type: CreateBrickDto,
    required: true,
    description: 'Create brick',
    examples: {
      brick: {
        value: {
          title: 'This is a title',
          description: 'This is a description',
          active: true,
        },
      },
    },
  })
  @ApiResponse({ type: UpdateBrickDto })
  createBrick(@Req() req: any, @Body() body: CreateBrickDto) {
    return this.brickService.createBrick(req.user.id, body);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  @ApiOperation({
    summary: 'Get a brick',
    description: 'Returns a brick.',
  })
  @ApiBearerAuth()
  @ApiResponse({ type: UpdateBrickDto })
  readBrick(@Req() req: any, @Param('id') id: number) {
    return this.brickService.readBrick(req.user.id, id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  @ApiOperation({
    summary: 'Update a brick',
    description: 'Updates a brick and returns it.',
  })
  @ApiBody({
    type: UpdateBrickDto,
    required: true,
    description: 'Update brick',
    examples: {
      brick: {
        value: {
          title: 'This is a title',
          description: 'This is a description',
          active: true,
        },
      },
    },
  })
  @ApiBearerAuth()
  @ApiResponse({ type: UpdateBrickDto })
  updateBrick(
    @Req() req: any,
    @Param('id') id: number,
    @Body() body: UpdateBrickDto,
  ) {
    return this.brickService.updateBrick(req.user.id, id, body);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  @ApiOperation({
    summary: 'Delete a brick',
    description: 'Deletes a brick.',
  })
  @ApiBearerAuth()
  @ApiResponse({ type: UpdateBrickDto })
  deleteBrick(@Req() req: any, @Param('id') id: number) {
    return this.brickService.deleteBrick(req.user.id, id);
  }
}
