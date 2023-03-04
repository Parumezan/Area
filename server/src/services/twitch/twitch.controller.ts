import { Controller, Req, Post, Body, UseGuards } from '@nestjs/common';
import { TwitchService } from './twitch.service';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Twitch')
@Controller('twitch')
export class TwitchController {
  constructor(private readonly twitchService: TwitchService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('callback')
  @ApiOperation({
    summary: 'Twitch callback',
    description: 'Twitch callback',
  })
  @ApiBearerAuth()
  @ApiResponse({
    schema: {
      type: 'object',
      properties: {
        access_token: {
          type: 'string',
        },
      },
    },
  })
  async twitchCallback(@Body() body, @Req() req): Promise<string> {
    console.log(body);
    const tokens = await this.twitchService.getTwitchAccessToken(body.code);
    console.log(tokens);
    this.twitchService.addTokenToDatabase(tokens, req.user.id);
    return 'Success';
  }
}
