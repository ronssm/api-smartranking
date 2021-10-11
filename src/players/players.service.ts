import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreatePlayerDTO } from './dtos/createPlayer.dto';
import { UpdatePlayerDTO } from './dtos/updatePlayer.dto';
import { Player } from './player.interface';

@Injectable()
export class PlayersService {
  private readonly logger = new Logger(PlayersService.name);

  constructor(
    @InjectModel('Player') private readonly playerModel: Model<Player>,
  ) {}

  async criarJogador(createPlayerDTO: CreatePlayerDTO): Promise<Player> {
    const { email } = createPlayerDTO;
    const jogadorEncontrado = await this.playerModel.findOne({ email }).exec();

    if (jogadorEncontrado) {
      throw new BadRequestException(`E-mail already exists`);
    }

    const jogadorCriado = new this.playerModel(createPlayerDTO);

    return await jogadorCriado.save();
  }

  async atualizarJogador(
    _id: string,
    updatePlayerDTO: UpdatePlayerDTO,
  ): Promise<void> {
    const jogadorEncontrado = await this.playerModel.findOne({ _id }).exec();

    if (!jogadorEncontrado) {
      throw new NotFoundException(`Player not found`);
    }

    await this.playerModel
      .findOneAndUpdate({ _id }, { $set: updatePlayerDTO })
      .exec();
  }

  async consultarTodosJogadores(): Promise<Player[]> {
    return await this.playerModel.find().exec();
  }

  async consultarJogadorPorId(_id: string): Promise<Player> {
    const jogadorEncontrado = await this.playerModel.findOne({ _id }).exec();
    if (!jogadorEncontrado) {
      throw new NotFoundException(`Player not found`);
    }
    return jogadorEncontrado;
  }

  async deletarJogador(_id: string): Promise<any> {
    const jogadorEncontrado = await this.playerModel.findOne({ _id }).exec();
    if (!jogadorEncontrado) {
      throw new NotFoundException(`Player not found`);
    }
    return await this.playerModel.deleteOne({ _id }).exec();
  }
}
