import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ParametersValidatorPipe } from '../common/pipes/parameters-validator.pipe';
import { CreatePlayerDTO } from './dtos/createPlayer.dto';
import { UpdatePlayerDTO } from './dtos/updatePlayer.dto';
import { Player } from './interfaces/player.interface';
import { PlayersService } from './players.service';

@Controller('api/v1/players')
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}

  @Get()
  async get(): Promise<Player[]> {
    return this.playersService.getAll();
  }

  @Get('/:_id')
  async getById(
    @Param('_id', ParametersValidatorPipe) _id: string,
  ): Promise<Player> {
    return this.playersService.getById(_id);
  }

  @Post()
  @UsePipes(ValidationPipe)
  async create(@Body() createPlayerDTO: CreatePlayerDTO): Promise<Player> {
    return this.playersService.create(createPlayerDTO);
  }

  @Put('/:_id')
  @UsePipes(ValidationPipe)
  async update(
    @Body() updatePlayerDTO: UpdatePlayerDTO,
    @Param('_id', ParametersValidatorPipe) _id: string,
  ): Promise<void> {
    await this.playersService.update(_id, updatePlayerDTO);
  }

  @Delete('/:_id')
  async remove(
    @Param('_id', ParametersValidatorPipe) _id: string,
  ): Promise<void> {
    await this.playersService.remove(_id);
  }
}
