import { Test, TestingModule } from '@nestjs/testing';
import { TwitchService } from './twitch.service';
import { PrismaProvider } from '../../prisma';
import { TwitchController } from './twitch.controller';

describe('TwitchService', () => {
  let service: TwitchService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TwitchController],
      providers: [TwitchService, PrismaProvider],
    }).compile();

    service = module.get<TwitchService>(TwitchService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
