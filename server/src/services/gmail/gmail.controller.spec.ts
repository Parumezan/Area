import { Test, TestingModule } from '@nestjs/testing';
import { GmailController } from './gmail.controller';
import { GmailService } from './gmail.service';
import { PrismaProvider } from '../../prisma';

describe('GmailController', () => {
  let controller: GmailController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GmailController],
      providers: [GmailService, PrismaProvider],
    }).compile();

    controller = module.get<GmailController>(GmailController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
