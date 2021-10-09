import { Body, Controller, Post } from '@nestjs/common';
import { CreatePlayerDTO } from './dto/createPlayer.dto';

@Controller('api/v1/players')
export class PlayersController {
  @Post()
  async criarAtualizarJogador(@Body() createPlayerDTO: CreatePlayerDTO) {
    const { email } = createPlayerDTO;
    return JSON.stringify(`{
      nome: ${email},
    }`);
  }
}
