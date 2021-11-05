import { Test, TestingModule } from '@nestjs/testing';
import { PlayersController } from '../players.controller';
import { PlayersService } from '../players.service';

describe('PlayersController', () => {
  let controller: PlayersController;

  const mockPlayersService = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlayersController],
      providers: [PlayersService],
    })
      .overrideProvider(PlayersService)
      .useValue(mockPlayersService)
      .compile();

    controller = module.get<PlayersController>(PlayersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
