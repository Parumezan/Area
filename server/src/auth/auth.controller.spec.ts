import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.stategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { PrismaProvider } from '../prisma';

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // CANNOT TEST THIS FUNCTION BECAUSE IT USES PRISMA
  // it("should return a jwt token", () => {
  //   const result = controller
  //     .login({
  //       id: 1,
  //       email: "Adolphe Thiers",
  //       password: "1871",
  //     })
  //     .then((result) => {
  //       expect(result.access_token).toBeDefined();
  //       // expect(result.access_token.split(".").length).toBe(3);
  //     });
  // });
});
