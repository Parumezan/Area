import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.stategy';
import { PrismaProvider } from '../prisma';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: 'ratio',
      signOptions: {
        expiresIn: 3600 * 24 * 30, // 30 days
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, PrismaProvider],
})
export class AuthModule {}
