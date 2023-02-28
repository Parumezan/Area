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
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateActionDto } from './dto/create-action.dto';
import { UpdateActionDto } from './dto/update-action.dto';

@ApiTags('Action')
@Controller('api/action')
export class ActionController {
  constructor(private readonly actionService: ActionService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get()
  @ApiOperation({
    summary: "Get all user's actions",
    description: "Returns an array of all user's actions.",
  })
  @ApiBearerAuth()
  @ApiResponse({ type: UpdateActionDto, isArray: true })
  readAllActions(@Req() req: any) {
    return this.actionService.readAllActions(req.user.id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/brick/:brickId')
  @ApiOperation({
    summary: "Get all user's actions from a brick",
    description: "Returns an array of all user's actions from a brick.",
  })
  @ApiBearerAuth()
  @ApiResponse({ type: UpdateActionDto, isArray: true })
  readActionsFromBrick(@Req() req: any, @Param('brickId') brickId: number) {
    return this.actionService.readActionsFromBrick(req.user.id, brickId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  @ApiOperation({
    summary: 'Create an action',
    description: 'Creates an action and returns it.',
  })
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
  @ApiBearerAuth()
  @ApiResponse({ type: UpdateActionDto })
  createAction(@Req() req: any, @Body() body: CreateActionDto) {
    return this.actionService.createAction(req.user.id, body);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  @ApiOperation({
    summary: 'Get an action',
    description: 'Returns an action.',
  })
  @ApiBearerAuth()
  @ApiResponse({ type: UpdateActionDto })
  readAction(@Req() req: any, @Param('id') id: number) {
    return this.actionService.readAction(req.user.id, id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  @ApiOperation({
    summary: 'Update an action',
    description: 'Updates an action and returns it.',
  })
  @ApiBearerAuth()
  @ApiBody({
    type: UpdateActionDto,
    required: true,
    description: 'Update action',
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
  @ApiResponse({ type: UpdateActionDto })
  updateAction(
    @Req() req: any,
    @Param('id') id: number,
    @Body() body: UpdateActionDto,
  ) {
    return this.actionService.updateAction(req.user.id, id, body);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  @ApiOperation({
    summary: 'Delete an action',
    description: 'Deletes an action.',
  })
  @ApiBearerAuth()
  deleteAction(@Req() req: any, @Param('id') id: number) {
    return this.actionService.deleteAction(req.user.id, id);
  }
}
