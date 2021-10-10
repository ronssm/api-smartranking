import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreatePlayerDTO } from './dto/createPlayer.dto';
import { Player } from './player.interface';
import { v4 as uuidV4 } from 'uuid';

@Injectable()
export class PlayersService {
  private readonly logger = new Logger(PlayersService.name);

  private players: Player[] = [];

  async criarAtualizarJogador(createPlayerDTO: CreatePlayerDTO): Promise<void> {
    const { email } = createPlayerDTO;
    const jogadorEncontrado = this.players.find((p) => p.email === email);

    if (jogadorEncontrado) {
      this.atualizar(jogadorEncontrado, createPlayerDTO);
    } else {
      this.criar(createPlayerDTO);
    }
  }

  async consultarTodosJogadores(): Promise<Player[]> {
    return this.players;
  }

  async consultarJogadorPorEmail(email: string): Promise<Player> {
    const jogadorEncontrado = this.players.find((p) => p.email === email);
    if (!jogadorEncontrado) {
      throw new NotFoundException(`Player not found`);
    }
    return jogadorEncontrado;
  }

  async deletarJogador(email: string): Promise<void> {
    const jogadorEncontrado = this.players.find((p) => p.email === email);
    this.players = this.players.filter(
      (p) => p.email !== jogadorEncontrado.email,
    );
  }

  private criar(createPlayerDTO: CreatePlayerDTO): void {
    const { name, email, phoneNumber } = createPlayerDTO;
    const player: Player = {
      _id: uuidV4(),
      name,
      phoneNumber,
      email,
      ranking: 'A',
      rankingPosition: 1,
      photoUrl: '',
    };
    this.logger.log(`createPlayerDTO: ${JSON.stringify(player)}`);
    this.players.push(player);
  }

  private atualizar(
    jogadorEncontrado: Player,
    createPlayerDTO: CreatePlayerDTO,
  ): void {
    const { name } = createPlayerDTO;
    jogadorEncontrado.name = name;
  }
}
