import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.stategy';
import { PrismaProvider } from '../prisma';

describe('AuthService', () => {
  let service: AuthService;

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

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // CANNOT TEST THIS FUNCTION BECAUSE IT USES PRISMA
  // it("should return an object", () => {
  //   const expectedOutput = {
  //     id: 1,
  //     email: "Adolphe Thiers",
  //   };
  //   const result = service
  //     .validateUser({ email: "Adolphe Thiers", password: "1871" })
  //     .then((result) => {
  //       expect(result).toEqual(expectedOutput);
  //     });
  // });
});
