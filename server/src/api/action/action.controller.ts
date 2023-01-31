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
import { ActionService } from './action.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiBody } from '@nestjs/swagger';
import { CreateActionDto } from './dto/create-action.dto';
import { UpdateActionDto } from './dto/update-action.dto';

@Controller('api/action')
export class ActionController {
  constructor(private readonly actionService: ActionService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get()
  readAllActions(@Req() req: any) {
    return this.actionService.readAllActions(req.user.id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/brick:brickId')
  readActionsFromBrick(@Req() req: any, @Param('brickId') brickId: number) {
    return this.actionService.readActionsFromBrick(req.user.id, brickId);
  }

  @ApiBody({
    type: CreateActionDto,
    required: true,
    description: 'Create action',
    examples: {
      brick: {
        value: {
          brickId: 1,
          serviceId: 1,
          actionType: 'TIME_IS_X',
          description: 'This action is triggered when the time is arguments[0]',
          isInput: true,
          arguments: ['15:59'],
        },
      },
    },
  })
  @UseGuards(AuthGuard('jwt'))
  @Post()
  createAction(@Req() req: any, @Body() body: CreateActionDto) {
    return this.actionService.createAction(req.user.id, body);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  readAction(@Req() req: any, @Param('id') id: number) {
    return this.actionService.readAction(req.user.id, id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  updateAction(
    @Req() req: any,
    @Param('id') id: number,
    @Body() body: UpdateActionDto,
  ) {
    return this.actionService.updateAction(req.user.id, id, body);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  deleteAction(@Req() req: any, @Param('id') id: number) {
    return this.actionService.deleteAction(req.user.id, id);
  }
}
