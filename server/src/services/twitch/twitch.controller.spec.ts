import { Test, TestingModule } from '@nestjs/testing';
import { TwitchController } from './twitch.controller';
import { TwitchService } from './twitch.service';
import { PrismaProvider } from '../../prisma';
import { LinkerService } from '../../linker/linker.service';

describe('Controller', () => {
  let controller: TwitchController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TwitchController],
      providers: [TwitchService, PrismaProvider, LinkerService],
    }).compile();

    controller = module.get<TwitchController>(TwitchController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
