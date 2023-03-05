import { Controller, Get, Req, Post, Body, UseGuards } from '@nestjs/common';
import { TwitterService } from './twitter.service';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Twitter')
@Controller('twitter')
export class TwitterController {
  constructor(private readonly twitterService: TwitterService) {}

  //   @UseGuards(AuthGuard('jwt'))
  @Get('requestToken')
  @ApiOperation({
    summary: 'Get twitter token',
    description: 'Get twitter token',
  })
  @ApiBearerAuth()
  @ApiResponse({
    schema: {
      type: 'object',
      properties: {
        oauth_token: {
          type: 'string',
        },
      },
    },
  })
  async getTwitterToken(): Promise<string> {
    const url = await this.twitterService.getTwitterToken();
    return url.oauth_token;
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('callback')
  @ApiOperation({
    summary: 'Twitter callback',
    description: 'Twitter callback',
  })
  @ApiBearerAuth()
  @ApiResponse({
    schema: {
      type: 'object',
      properties: {
        status: {
          type: 'string',
        },
      },
    },
  })
  async twitterCallback(@Body() body, @Req() req: any): Promise<string> {
    try {
      const token = await this.twitterService.getTwitterAccessToken(
        body.oauthToken,
        body.oauthVerifier,
      );
      this.twitterService.addTokenToDatabase(token, req.user.id);
    } catch (e) {
      console.log(e);
      return 'Error';
    }
    return 'Success';
  }
}
