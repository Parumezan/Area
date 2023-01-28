import { Injectable, Inject, HttpException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Account, PrismaClient } from '@prisma/client';
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

  async login(user: Account) {
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

  async register(user: Account) {
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

  async logout(req, res) {
    req.headers.authorization = null;
    res.redirect('/');
  }
}
