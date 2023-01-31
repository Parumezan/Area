import { Test, TestingModule } from '@nestjs/testing';
import { ActionService } from './action.service';
import { ActionController } from './action.controller';
import { PrismaProvider } from '../../prisma';

describe('ActionService', () => {
  let service: ActionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ActionController],
      providers: [ActionService, PrismaProvider],
    }).compile();

    service = module.get<ActionService>(ActionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
