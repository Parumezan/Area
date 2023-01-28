import { Test, TestingModule } from '@nestjs/testing';
import { BaseService } from './base.service';
import { PrismaProvider } from '../../prisma';

describe('BaseService', () => {
  let service: BaseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BaseService, PrismaProvider],
    }).compile();

    service = module.get<BaseService>(BaseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
