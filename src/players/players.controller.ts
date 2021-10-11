import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreatePlayerDTO } from './dto/createPlayer.dto';
import { Player } from './player.interface';
import { PlayersService } from './players.service';

@Controller('api/v1/players')
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}

  @Post()
  @UsePipes(ValidationPipe)
  async criarAtualizarJogador(@Body() createPlayerDTO: CreatePlayerDTO) {
    await this.playersService.criarAtualizarJogador(createPlayerDTO);
  }

  @Get()
  async consultarJogadores(
    @Query('email') email: string,
  ): Promise<Player[] | Player> {
    if (email) {
      return await this.playersService.consultarJogadorPorEmail(email);
    } else {
      return await this.playersService.consultarTodosJogadores();
    }
  }

  @Delete()
  async deletarJogador(@Query('email') email: string): Promise<void> {
    await this.playersService.deletarJogador(email);
  }
}
