import { Test, TestingModule } from '@nestjs/testing';
import { ClockController } from './clock.controller';
import { ClockService } from './clock.service';
import { PrismaProvider } from '../../prisma';

describe('ClockController', () => {
  let controller: ClockController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClockController],
      providers: [ClockService, PrismaProvider],
    }).compile();

    controller = module.get<ClockController>(ClockController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
