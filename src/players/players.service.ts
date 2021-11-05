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
import { Player } from './interfaces/player.interface';

@Injectable()
export class PlayersService {
  constructor(
    @InjectModel('Player') private readonly playerModel: Model<Player>,
  ) {}

  private readonly logger = new Logger(PlayersService.name);

  async create(createPlayerDTO: CreatePlayerDTO): Promise<Player> {
    const { email } = createPlayerDTO;

    const foundPlayer = await this.playerModel.findOne({ email }).exec();

    if (foundPlayer) {
      throw new BadRequestException(`Player already exists`);
    }

    const newPlayer = new this.playerModel(createPlayerDTO);
    return newPlayer.save();
  }

  async update(_id: string, updatePlayerDTO: UpdatePlayerDTO): Promise<void> {
    const foundPlayer = await this.playerModel.findOne({ _id }).exec();

    if (!foundPlayer) {
      throw new NotFoundException(`Player not found`);
    }

    await this.playerModel
      .findOneAndUpdate({ _id }, { $set: updatePlayerDTO })
      .exec();
  }

  async getAll(): Promise<Player[]> {
    return this.playerModel.find().exec();
  }

  async getById(_id: string): Promise<Player> {
    const foundPlayer = await this.playerModel.findOne({ _id }).exec();

    if (!foundPlayer) {
      throw new NotFoundException(`Player not found`);
    }

    return foundPlayer;
  }

  async remove(_id): Promise<any> {
    const foundPlayer = await this.playerModel.findOne({ _id }).exec();

    if (!foundPlayer) {
      throw new NotFoundException(`Player not found`);
    }

    return this.playerModel.deleteOne({ _id }).exec();
  }
}
