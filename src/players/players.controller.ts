import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ParametersValidatorPipe } from 'src/common/pipes/parameters-validator.pipe';
import { CreatePlayerDTO } from './dtos/createPlayer.dto';
import { UpdatePlayerDTO } from './dtos/updatePlayer.dto';
import { Player } from './interfaces/player.interface';
import { PlayersService } from './players.service';

@Controller('api/v1/players')
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}

  @Post()
  @UsePipes(ValidationPipe)
  async create(@Body() createPlayerDTO: CreatePlayerDTO): Promise<Player> {
    return await this.playersService.create(createPlayerDTO);
  }

  @Put('/:_id')
  @UsePipes(ValidationPipe)
  async update(
    @Body() updatePlayerDTO: UpdatePlayerDTO,
    @Param('_id', ParametersValidatorPipe) _id: string,
  ): Promise<void> {
    await this.playersService.update(_id, updatePlayerDTO);
  }

  /*
    Desafio
    Passamos a utilizar query parameters com o verbo GET
    */

  @Get()
  async get(@Query('playerId') _id: string): Promise<Player[] | Player> {
    if (_id) {
      return await this.playersService.getById(_id);
    }

    return await this.playersService.getAll();
  }

  /*
    @Get('/:_id')
    async consultarJogadorPeloId(
        @Param('_id', ValidacaoParametrosPipe) _id: string): Promise<Jogador> {
                return await this.jogadoresService.consultarJogadorPeloId(_id);    
    }
    */

  @Delete('/:_id')
  async remove(
    @Param('_id', ParametersValidatorPipe) _id: string,
  ): Promise<void> {
    await this.playersService.remove(_id);
  }
}
