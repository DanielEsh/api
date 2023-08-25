import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseArrayPipe,
  DefaultValuePipe,
  Query,
  ParseIntPipe,
  HttpException,
  HttpStatus,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Category } from './entities/category.entity';

const DEFAULT_VALUES = {
  limit: 10,
  page: 1,
  sort_by: [],
  order_by: [],
};

@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @ApiOperation({ summary: 'Create category' })
  @ApiBody({ type: CreateCategoryDto })
  @ApiCreatedResponse({ type: Category })
  @Post()
  @UsePipes(new ValidationPipe())
  create(@Body() createCategoryDto: CreateCategoryDto) {
    try {
      return this.categoriesService.createCategory(createCategoryDto);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.CONFLICT);
    }
  }

  @Get()
  findAll(
    @Query('page', new DefaultValuePipe(DEFAULT_VALUES.page), ParseIntPipe)
    page,
    @Query('limit', new DefaultValuePipe(DEFAULT_VALUES.limit), ParseIntPipe)
    limit,
    @Query(
      'sort_by',
      new DefaultValuePipe(DEFAULT_VALUES.sort_by),
      ParseArrayPipe,
    )
    sort,
    @Query(
      'order_by',
      new DefaultValuePipe(DEFAULT_VALUES.order_by),
      ParseArrayPipe,
    )
    order,
  ) {
    return this.categoriesService.findAll({
      sort,
      order,
      page,
      limit,
      route: ' ',
    });
  }

  @Get(':slug')
  findOne(@Param('slug') slug: string) {
    return this.categoriesService.findOneBySlug(slug);
  }

  @Patch(':slug')
  update(
    @Param('slug') slug: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(slug, updateCategoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(+id);
  }
}
