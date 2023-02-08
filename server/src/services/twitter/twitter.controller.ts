import {
  Controller,
  Get,
  Req,
  Post,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { TwitterService } from './twitter.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('twitter')
export class TwitterController {
  constructor(private readonly twitterService: TwitterService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('requestToken')
  async getTwitterToken(): Promise<string> {
    const url = await this.twitterService.getTwitterToken();
    return url.oauth_token;
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('callback')
  async twitterCallback(@Body() body, @Req() req: any): Promise<String> {
    const token = await this.twitterService.getTwitterAccessToken(
      body.oauthToken,
      body.oauthVerifier,
    );
    this.twitterService.addTokenToDatabase(token, req.user.id);
    return 'Success';
  }
}
