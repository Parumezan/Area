import { Test, TestingModule } from '@nestjs/testing';
import { GmailService } from './gmail.service';
import { GmailController } from './gmail.controller';
import { PrismaProvider } from '../../prisma';

describe('GmailService', () => {
  let service: GmailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GmailController],
      providers: [GmailService, PrismaProvider],
    }).compile();

    service = module.get<GmailService>(GmailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
