import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PlayersService } from 'src/players/players.service';
import { CreateCategoryDTO } from './dtos/createCategory.dto';
import { UpdateCategoryDTO } from './dtos/updateCategory.dto';
import { Category } from './interfaces/category.interface';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel('Category') private readonly categoryModel: Model<Category>,
    private readonly playersService: PlayersService,
  ) {}

  private logger = new Logger(CategoriesService.name);

  async create(createCategoryDTO: CreateCategoryDTO): Promise<Category> {
    const { category } = createCategoryDTO;

    const foundCategory = await this.categoryModel.findOne({ category }).exec();

    if (foundCategory) {
      throw new BadRequestException(`Category already exists`);
    }

    const newCategory = new this.categoryModel(createCategoryDTO);
    return await newCategory.save();
  }

  async getAll(): Promise<Array<Category>> {
    return await this.categoryModel.find().populate('players').exec();
  }

  async getById(_id: string): Promise<Category> {
    const foundCategory = await this.categoryModel.findOne({ _id }).exec();

    if (!foundCategory) {
      throw new NotFoundException(`Category not found`);
    }

    return foundCategory;
  }

  async getPlayerCategory(playerId: any): Promise<Category> {
    /*
        Desafio
        Escopo da exceção realocado para o próprio Categorias Service
        Verificar se o jogador informado já se encontra cadastrado
        */

    //await this.playersService.consultarJogadorPeloId(playerId)

    const players = await this.playersService.getAll();

    const playerFilter = players.filter((player) => player._id == playerId);

    if (playerFilter.length == 0) {
      throw new BadRequestException(`Player not found`);
    }

    return await this.categoryModel
      .findOne()
      .where('players')
      .in(playerId)
      .exec();
  }

  async update(
    _id: string,
    updateCategoryDTO: UpdateCategoryDTO,
  ): Promise<void> {
    const foundCategory = await this.categoryModel.findOne({ _id }).exec();

    if (!foundCategory) {
      throw new NotFoundException(`Category not found`);
    }

    await this.categoryModel
      .findOneAndUpdate({ _id }, { $set: updateCategoryDTO })
      .exec();
  }

  async associatePlayer(params: string[]): Promise<void> {
    const _id = params['_id'];
    const playerId = params['playerId'];

    const foundCategory = await this.categoryModel.findOne({ _id }).exec();
    const playerAlreadyAssociated = await this.categoryModel
      .findOne()
      .where('players')
      .in(playerId)
      .exec();

    /*
        Desafio
        Escopo da exceção realocado para o próprio Categorias Service
        Verificar se o jogador informado já se encontra cadastrado
        */

    //await this.playersService.consultarJogadorPeloId(playerId)

    const players = await this.playersService.getAll();

    const playerFilter = players.filter((player) => player._id == playerId);

    if (playerFilter.length == 0) {
      throw new BadRequestException(`Player not found`);
    }

    if (!foundCategory) {
      throw new BadRequestException(`Category not found`);
    }

    if (playerAlreadyAssociated) {
      throw new BadRequestException(`Player already associated`);
    }

    foundCategory.players.push(playerId);
    await this.categoryModel
      .findOneAndUpdate({ _id }, { $set: foundCategory })
      .exec();
  }
}
