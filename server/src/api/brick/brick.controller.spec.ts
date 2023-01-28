import { Test, TestingModule } from '@nestjs/testing';
import { BrickController } from './brick.controller';
import { BrickService } from './brick.service';
import { PrismaProvider } from '../../prisma';

describe('BrickController', () => {
  let controller: BrickController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BrickController],
      providers: [BrickService, PrismaProvider],
    }).compile();

    controller = module.get<BrickController>(BrickController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
