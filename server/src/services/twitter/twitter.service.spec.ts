import { Test, TestingModule } from '@nestjs/testing';
import { TwitterService } from './twitter.service';
import { TwitterController } from './twitter.controller';
import { PrismaProvider } from '../../prisma';

describe('TwitterService', () => {
  let service: TwitterService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TwitterController],
      providers: [TwitterService, PrismaProvider],
    }).compile();

    service = module.get<TwitterService>(TwitterService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
