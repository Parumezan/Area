import { Controller, Get, UseGuards, Redirect } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TwitterService } from './twitter.service';

@Controller('twitter')
export class TwitterController {
  constructor(private readonly twitterService: TwitterService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get()
  getTwitter(): string {
    return this.twitterService.getTwitter();
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/request-token')
  @Redirect('https://api.twitter.com/oauth/request_token', 302)
  requestToken() {}
}
