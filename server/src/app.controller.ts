import { Controller, Get, Req, Res, Ip } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  redirect(@Req() req: ParameterDecorator, @Res() res: ParameterDecorator) {
    this.appService.redirect(req, res);
  }

  @Get('about.json')
  about(@Ip() ip: string) {
    return this.appService.about(ip);
  }
}
