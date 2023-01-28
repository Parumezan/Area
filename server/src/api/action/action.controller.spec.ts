import { Test, TestingModule } from '@nestjs/testing';
import { ActionController } from './action.controller';
import { ActionService } from './action.service';
import { PrismaProvider } from '../../prisma';

describe('ActionController', () => {
  let controller: ActionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ActionController],
      providers: [ActionService, PrismaProvider],
    }).compile();

    controller = module.get<ActionController>(ActionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
