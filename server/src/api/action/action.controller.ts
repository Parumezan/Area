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
import { ActionService } from './action.service';
import { Action } from '@prisma/client';
import { AuthGuard } from '@nestjs/passport';

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
  readActionsFromBrick(@Req() req: any, @Param('brickId') brickId: string) {
    return this.actionService.readActionsFromBrick(
      req.user.id,
      parseInt(brickId),
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  createAction(@Req() req: any, @Body() body: Action) {
    return this.actionService.createAction(req.user.id, body);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  readAction(@Req() req: any, @Param('id') id: string) {
    return this.actionService.readAction(req.user.id, parseInt(id));
  }

  @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  updateAction(@Req() req: any, @Param('id') id: string, @Body() body: Action) {
    return this.actionService.updateAction(req.user.id, parseInt(id), body);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  deleteAction(@Req() req: any, @Param('id') id: string) {
    return this.actionService.deleteAction(req.user.id, parseInt(id));
  }
}
