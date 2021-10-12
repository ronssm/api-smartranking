import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { Category } from './category.interface';
import { CreateCategoryDTO } from './dtos/createCategory.dto';
import { UpdateCategoryDTO } from './dtos/updateCategory.dto';

@Controller('api/v1/categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @UsePipes(ValidationPipe)
  async criarCategoria(
    @Body() createCategoryDTO: CreateCategoryDTO,
  ): Promise<Category> {
    return await this.categoriesService.createCategory(createCategoryDTO);
  }

  @Get()
  async consultarCategorias(): Promise<Category[]> {
    return await this.categoriesService.consultarTodasCategorias();
  }

  @Get('/:_id')
  async consultarCategoriaPorId(@Param('_id') _id: string): Promise<Category> {
    return await this.categoriesService.consultarCategoriaPorId(_id);
  }

  @Put('/:_id')
  @UsePipes(ValidationPipe)
  async atualizarCategoria(
    @Body() updateCategoryDTO: UpdateCategoryDTO,
    @Param('_id') _id: string,
  ): Promise<void> {
    await this.categoriesService.atualizarCategoria(_id, updateCategoryDTO);
  }

  @Post('/:_idCategoria/player/:_idJogador')
  async atribuirCategoriaJogador(@Param() params: string[]): Promise<void> {
    await this.categoriesService.atribuirCategoriaJogador(params);
  }
}
