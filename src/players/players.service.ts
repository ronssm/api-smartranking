import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreatePlayerDTO } from './dto/createPlayer.dto';
import { Player } from './player.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class PlayersService {
  private readonly logger = new Logger(PlayersService.name);

  constructor(
    @InjectModel('Player') private readonly playerModel: Model<Player>,
  ) {}

  async criarAtualizarJogador(createPlayerDTO: CreatePlayerDTO): Promise<void> {
    const { email } = createPlayerDTO;
    const jogadorEncontrado = await this.playerModel.findOne({ email }).exec();

    if (jogadorEncontrado) {
      this.atualizar(createPlayerDTO);
    } else {
      this.criar(createPlayerDTO);
    }
  }

  async consultarTodosJogadores(): Promise<Player[]> {
    return await this.playerModel.find().exec();
  }

  async consultarJogadorPorEmail(email: string): Promise<Player> {
    const jogadorEncontrado = await this.playerModel.findOne({ email }).exec();
    if (!jogadorEncontrado) {
      throw new NotFoundException(`Player not found`);
    }
    return jogadorEncontrado;
  }

  async deletarJogador(email: string): Promise<void> {
    return await this.playerModel.remove({ email }).exec();
  }

  private async criar(createPlayerDTO: CreatePlayerDTO): Promise<Player> {
    const jogadorCriado = new this.playerModel(createPlayerDTO);

    return await jogadorCriado.save();
  }

  private async atualizar(createPlayerDTO: CreatePlayerDTO): Promise<Player> {
    return await this.playerModel
      .findOneAndUpdate(
        { email: createPlayerDTO.email },
        { $set: createPlayerDTO },
      )
      .exec();
  }
}
