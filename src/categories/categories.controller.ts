import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDTO } from './dtos/createCategory.dto';
import { UpdateCategoryDTO } from './dtos/updateCategory.dto';
import { Category } from './interfaces/category.interface';

@Controller('api/v1/categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @UsePipes(ValidationPipe)
  async create(
    @Body() createCategoryDTO: CreateCategoryDTO,
  ): Promise<Category> {
    return await this.categoriesService.create(createCategoryDTO);
  }

  /*
    Desafio
    Passamos a utilizado query parameters com o verbo Get
    */

  @Get()
  async get(@Query() params: string[]): Promise<Array<Category> | Category> {
    const categoryId = params['categoryId'];
    const playerId = params['playerId'];

    if (categoryId) {
      return await this.categoriesService.getById(categoryId);
    }

    if (playerId) {
      return await this.categoriesService.getPlayerCategory(playerId);
    }

    return await this.categoriesService.getAll();
  }

  /*
    @Get()
    async consultarCategorias(): Promise<Array<Categoria>> {
        return await this.categoriesService.consultarTodasCategorias()
    }
    */

  /*
    @Get('/:categoria')
    async consultarCategoriaPeloId(
        @Param('categoria') categoria: string): Promise<Categoria> {
            return await this.categoriesService.consultarCategoriaPeloId(categoria)
        }
    */

  @Put('/:_id')
  @UsePipes(ValidationPipe)
  async update(
    @Body() updateCategoryDTO: UpdateCategoryDTO,
    @Param('_id') _id: string,
  ): Promise<void> {
    await this.categoriesService.update(_id, updateCategoryDTO);
  }

  @Post('/:_id/player/:playerId')
  async associatePlayer(@Param() params: string[]): Promise<void> {
    return await this.categoriesService.associatePlayer(params);
  }
}
