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
import { CreatePlayerDTO } from './dtos/createPlayer.dto';
import { UpdatePlayerDTO } from './dtos/updatePlayer.dto';
import { PlayersParamsValidatorPipe } from './pipes/players-params-validator.pipe';
import { Player } from './player.interface';
import { PlayersService } from './players.service';

@Controller('api/v1/players')
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}

  @Post()
  @UsePipes(ValidationPipe)
  async criarJogador(
    @Body() createPlayerDTO: CreatePlayerDTO,
  ): Promise<Player> {
    return await this.playersService.criarJogador(createPlayerDTO);
  }

  @Put('/:_id')
  @UsePipes(ValidationPipe)
  async atualizarJogador(
    @Body() updatePlayerDTO: UpdatePlayerDTO,
    @Param('_id', PlayersParamsValidatorPipe) _id: string,
  ): Promise<void> {
    await this.playersService.atualizarJogador(_id, updatePlayerDTO);
  }

  @Get()
  async consultarJogadores(): Promise<Player[]> {
    return await this.playersService.consultarTodosJogadores();
  }

  @Get('/:_id')
  async consultarJogadorPorId(
    @Param('_id', PlayersParamsValidatorPipe) _id: string,
  ): Promise<Player> {
    return await this.playersService.consultarJogadorPorId(_id);
  }

  @Delete('/:_id')
  async deletarJogador(
    @Param('_id', PlayersParamsValidatorPipe) _id: string,
  ): Promise<void> {
    await this.playersService.deletarJogador(_id);
  }
}
