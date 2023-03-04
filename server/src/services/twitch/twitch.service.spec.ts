import { Test, TestingModule } from '@nestjs/testing';
import { TwitchService } from './twitch.service';
import { PrismaProvider } from '../../prisma';
import { LinkerService } from '../../linker/linker.service';
import { TwitchController } from './twitch.controller';

describe('Service', () => {
  let service: TwitchService;
  const twitchApiUrl = 'https://api.twitch.tv/helix';
  const authToken = '5beizdmwvnm90iisap14s0f9cwdz9b';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TwitchController],
      providers: [TwitchService, PrismaProvider, LinkerService],
    }).compile();

    service = module.get<TwitchService>(TwitchService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  /* it('should return the user ID', async () => {
    const username = 'gotaga';
    const userId = '24147592';
    const mockResponse = {
      data: {
        data: [
          {
            id: userId,
          },
        ],
      },
    };
    const result = await service.getUserId(username, authToken);
    expect(result).toEqual(userId);
  }); */
});
