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
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { Category } from './entities/category.entity';

const DEFAULT_VALUES = {
  limit: 10,
  page: 1,
  sort_by: [],
  order_by: [],
};

@ApiTags('categories')
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

  @ApiOperation({ summary: 'Read categories' })
  @ApiQuery({ name: 'page', type: Number, example: 1, required: true })
  @ApiQuery({ name: 'limit', type: Number, example: 10, required: true })
  @ApiQuery({ name: 'sortBy', type: String, example: null, required: false })
  @ApiQuery({ name: 'orderBy', type: String, example: null, required: false })
  @Get()
  findAll(
    @Query('page', new DefaultValuePipe(DEFAULT_VALUES.page), ParseIntPipe)
    page,
    @Query('limit', new DefaultValuePipe(DEFAULT_VALUES.limit), ParseIntPipe)
    limit,
    @Query(
      'sortBy',
      new DefaultValuePipe(DEFAULT_VALUES.sort_by),
      ParseArrayPipe,
    )
    sortBy,
    @Query(
      'orderBy',
      new DefaultValuePipe(DEFAULT_VALUES.order_by),
      ParseArrayPipe,
    )
    orderBy,
  ) {
    return this.categoriesService.findAll({
      sortBy,
      orderBy,
      page,
      limit,
    });
  }

  @ApiOperation({ summary: 'Read category by id param' })
  @ApiParam({
    name: 'id',
    type: Number,
    example: 10,
    required: true,
  })
  @ApiOkResponse({ type: Category })
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.categoriesService.findOneById(id);
  }

  @ApiOperation({ summary: 'Update category by slug param' })
  @ApiParam({
    name: 'slug',
    type: String,
    example: 'example-slug',
    required: true,
  })
  @ApiBody({ type: UpdateCategoryDto })
  @ApiOkResponse({ type: Category })
  @Patch(':slug')
  update(
    @Param('slug') slug: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(slug, updateCategoryDto);
  }

  @ApiOperation({ summary: 'Delete category by id' })
  @ApiOkResponse({ type: Category })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(+id);
  }
}
