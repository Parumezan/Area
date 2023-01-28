import { Test, TestingModule } from '@nestjs/testing';
import { ClockController } from './clock.controller';

describe('ClockController', () => {
  let controller: ClockController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClockController],
    }).compile();

    controller = module.get<ClockController>(ClockController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
