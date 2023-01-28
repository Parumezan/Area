import { Test, TestingModule } from '@nestjs/testing';
import { ClockController } from './clock.controller';
import { ClockService } from './clock.service';
import { PrismaProvider } from '../../prisma';

describe('ClockService', () => {
  let service: ClockService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClockController],
      providers: [ClockService, PrismaProvider],
    }).compile();

    service = module.get<ClockService>(ClockService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
