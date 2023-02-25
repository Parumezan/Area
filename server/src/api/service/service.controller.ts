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
import { ServiceService } from './service.service';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';

@ApiTags('Service')
@Controller('api/service')
export class ServiceController {
  constructor(private readonly brickService: ServiceService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get()
  @ApiOperation({
    summary: "Get all user's services",
    description: "Returns an array of all user's services.",
  })
  @ApiBearerAuth()
  @ApiResponse({ type: UpdateServiceDto, isArray: true })
  readAllServices(@Req() req: any) {
    return this.brickService.readAllServices(req.user.id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  @ApiOperation({
    summary: 'Create a service',
    description: 'Creates a service and returns it.',
  })
  @ApiBearerAuth()
  @ApiBody({
    type: CreateServiceDto,
    required: true,
    description: 'Create brick',
    examples: {
      brick: {
        value: {
          title: 'This is a title',
          serviceToken: 'example',
          serviceTokenSecret: 'example',
        },
      },
    },
  })
  @ApiResponse({ type: UpdateServiceDto })
  createService(@Req() req: any, @Body() body: CreateServiceDto) {
    return this.brickService.createService(req.user.id, body);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  @ApiOperation({
    summary: 'Get a service',
    description: 'Returns a service.',
  })
  @ApiBearerAuth()
  @ApiResponse({ type: UpdateServiceDto })
  readService(@Req() req: any, @Param('id') id: number) {
    return this.brickService.readService(req.user.id, id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  @ApiOperation({
    summary: 'Update a service',
    description: 'Updates a service and returns it.',
  })
  @ApiBearerAuth()
  @ApiBody({
    type: UpdateServiceDto,
    required: true,
    description: 'Update service',
    examples: {
      brick: {
        value: {
          title: 'This is a title',
          serviceToken: 'example',
          serviceTokenSecret: 'example',
        },
      },
    },
  })
  @ApiResponse({ type: UpdateServiceDto })
  updateService(
    @Req() req: any,
    @Param('id') id: number,
    @Body() body: UpdateServiceDto,
  ) {
    return this.brickService.updateService(req.user.id, id, body);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  @ApiOperation({
    summary: 'Delete a service',
    description: 'Deletes a service and returns it.',
  })
  @ApiBearerAuth()
  @ApiResponse({ type: UpdateServiceDto })
  deleteService(@Req() req: any, @Param('id') id: number) {
    return this.brickService.deleteService(req.user.id, id);
  }
}
