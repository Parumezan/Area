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
  async twitterCallback(@Body() body, @Req() req: any): Promise<string> {
    const tokens = await this.twitchService.getTwitterAccessToken(body.code);
    console.log(tokens);
    this.twitchService.addTokenToDatabase(tokens, req.user.id);
    return 'Success';
  }

  @Post('testMessage')
  @ApiOperation({
    summary: 'Test message',
    description: 'Test message',
  })
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
  async testMessage(): Promise<string> {
    const result = await this.twitchService.testMessage(
      'f93qaj7laornw86mss1c4fx36negr1',
      'pichade5',
      'Bonjour bot pierre',
    );
    return result.toString();
  }
}
