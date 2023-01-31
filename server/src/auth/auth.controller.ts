import {
  Controller,
  Get,
  Post,
  UseGuards,
  Req,
  Res,
  Body,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiBody } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiBody({
    type: LoginDto,
    required: true,
    description: 'Login',
    examples: {
      user: {
        value: {
          email: 'AdolpheThiers@mail.com',
          password: '18711873',
        },
      },
    },
  })
  @Post('login')
  async login(@Body() body: LoginDto) {
    return this.authService.login(body);
  }

  @ApiBody({
    type: LoginDto,
    required: true,
    description: 'Login',
    examples: {
      user: {
        value: {
          email: 'AdolpheThiers@mail.com',
          password: '18711873',
        },
      },
    },
  })
  @Post('register')
  async register(@Body() body: LoginDto) {
    return this.authService.register(body);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('logout')
  logout(@Req() req: ParameterDecorator, @Res() res: ParameterDecorator) {
    return this.authService.logout(req, res);
  }
}
