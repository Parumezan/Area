import { Test, TestingModule } from '@nestjs/testing';
import { BrickService } from './brick.service';
import { PrismaProvider } from '../../prisma';

describe('BrickService', () => {
  let service: BrickService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BrickService],
      providers: [BrickService, PrismaProvider],
    }).compile();

    service = module.get<BrickService>(BrickService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
