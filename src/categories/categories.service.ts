import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PlayersService } from 'src/players/players.service';
import { Category } from './category.interface';
import { CreateCategoryDTO } from './dtos/createCategory.dto';
import { UpdateCategoryDTO } from './dtos/updateCategory.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel('Category') private readonly categoryModel: Model<Category>,
    private readonly playersService: PlayersService,
  ) {}

  async createCategory(
    createCategoryDTO: CreateCategoryDTO,
  ): Promise<Category> {
    const { category } = createCategoryDTO;
    const foundCategory = await this.categoryModel.findOne({ category }).exec();

    if (foundCategory) {
      throw new BadRequestException(`Category already exists`);
    }

    const createdCategory = new this.categoryModel(createCategoryDTO);

    return await createdCategory.save();
  }

  async consultarTodasCategorias(): Promise<Category[]> {
    return await this.categoryModel.find().populate('players').exec();
  }

  async consultarCategoriaPorId(_id: string): Promise<Category> {
    const foundCategory = await this.categoryModel.findOne({ _id }).exec();
    if (!foundCategory) {
      throw new NotFoundException(`Category not found`);
    }
    return foundCategory;
  }

  async atualizarCategoria(
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

  async atribuirCategoriaJogador(params: string[]): Promise<void> {
    const _idCategoria = params['_idCategoria'];
    const _idJogador = params['_idJogador'];

    const foundCategory = await this.categoryModel
      .findOne({ _id: _idCategoria })
      .exec();

    if (!foundCategory) {
      throw new NotFoundException(`Category not found`);
    }

    await this.playersService.consultarJogadorPorId(_idJogador);

    const playerAlreadyAssociatedWithCategory = await this.categoryModel
      .find({ _id: _idCategoria })
      .where('players')
      .in(_idJogador)
      .exec();

    if (playerAlreadyAssociatedWithCategory) {
      throw new NotFoundException(`Player already associated with category`);
    }

    foundCategory.players.push(_idJogador);
    await this.categoryModel
      .findOneAndUpdate({ _id: _idCategoria }, { $set: foundCategory })
      .exec();
  }
}
