import { Injectable, Inject, HttpException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Account, PrismaClient } from '@prisma/client';
import { LoginDto } from './dto/login.dto';
import { OauthGoogleDto } from './dto/oauthGoogleDto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @Inject('Prisma') private readonly prisma: PrismaClient,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<Account> {
    const user = this.prisma.account
      .findUnique({
        where: {
          email: email,
        },
      })
      .then((user) => {
        if (user) {
          if (bcrypt.compareSync(password, user.password)) {
            return user;
          }
        }
        return null;
      });
    return user;
  }

  async login(user: LoginDto) {
    const DBuser = await this.validateUser(user.email, user.password);
    if (!DBuser) {
      throw new HttpException('Forbidden', 403);
    }
    return {
      access_token: this.jwtService.sign({
        id: DBuser.id,
        email: DBuser.email,
      }),
    };
  }

  async register(user: LoginDto) {
    if (
      await this.prisma.account.findUnique({ where: { email: user.email } })
    ) {
      throw new HttpException('Forbidden', 403);
    }
    if (user.password.length < 8) {
      throw new HttpException('Forbidden', 403);
    }
    const regex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    if (!regex.test(user.email)) {
      throw new HttpException('Forbidden', 403);
    }
    const hashedPassword = bcrypt.hashSync(user.password, 10);
    const newUser = await this.prisma.account.create({
      data: {
        email: user.email,
        password: hashedPassword,
      },
    });
    return {
      access_token: this.jwtService.sign({
        id: newUser.id,
        email: newUser.email,
      }),
    };
  }

  async requestGoogleToken(code: string): Promise<string> {
    const response = await fetch(`https://oauth2.googleapis.com/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `code=${code}&client_id=${
        process.env.GOOGLE_CLIENT_ID
      }&client_secret=${
        process.env.GOOGLE_CLIENT_SECRET
      }&redirect_uri=${encodeURIComponent(
        process.env.OAUTH2_REDIRECT_URI + '_google',
      )}&grant_type=authorization_code`,
    })
      .then((res) => res.json())
      .catch((err) => console.log(err));
    return response;
  }

  async oauthGoogle(user: OauthGoogleDto) {
    const json = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/http',
        Authorization: `Bearer ${user.oauthToken}`,
      },
    })
      .then((res) => res.json())
      .catch((err) => console.log(err));

    const userId = await this.prisma.account.findUnique({
      where: { email: json.email },
    });
    if (userId) {
      return {
        access_token: this.jwtService.sign({
          id: userId.id,
          email: userId.email,
        }),
      };
    }

    const newUser = await this.prisma.account.create({
      data: {
        email: json.email,
        password: '',
      },
    });
    return {
      access_token: this.jwtService.sign({
        id: newUser.id,
        email: newUser.email,
      }),
    };
  }

  async logout(req, res) {
    req.headers.authorization = null;
    res.redirect('/');
  }
}
