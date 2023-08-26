import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UsePipes,
  ValidationPipe,
  HttpException,
  HttpStatus,
  DefaultValuePipe,
  ParseIntPipe,
  ParseArrayPipe,
  Query,
} from '@nestjs/common';
import { BrandsService } from './brands.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { Brand } from './entities/brand.entity';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';

const DEFAULT_VALUES = {
  limit: 10,
  page: 1,
  sort_by: [],
  order_by: [],
};

@ApiTags('brands')
@Controller('brands')
export class BrandsController {
  constructor(private readonly brandsService: BrandsService) {}

  @ApiOperation({ summary: 'Create brand' })
  @ApiBody({ type: CreateBrandDto })
  @ApiCreatedResponse({ type: Brand })
  @Post()
  @UsePipes(new ValidationPipe())
  create(@Body() createBrandDto: CreateBrandDto) {
    try {
      return this.brandsService.create(createBrandDto);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.CONFLICT);
    }
  }

  @ApiOperation({ summary: 'Read brands' })
  @ApiQuery({ name: 'page', type: Number, example: 1, required: true })
  @ApiQuery({ name: 'limit', type: Number, example: 10, required: true })
  @ApiQuery({ name: 'sort_by', type: String, example: null, required: false })
  @ApiQuery({ name: 'order_by', type: String, example: null, required: false })
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
    sortBy,
    @Query(
      'order_by',
      new DefaultValuePipe(DEFAULT_VALUES.order_by),
      ParseArrayPipe,
    )
    orderBy,
  ) {
    return this.brandsService.findAll({
      sortBy,
      orderBy,
      page,
      limit,
    });
  }

  @ApiOperation({ summary: 'Read brand by slug param' })
  @ApiParam({
    name: 'slug',
    type: String,
    example: 'example-slug',
    required: true,
  })
  @ApiOkResponse({ type: Brand })
  @Get(':slug')
  findOne(@Param('slug') slug: string) {
    return this.brandsService.findOneBySlug(slug);
  }

  @ApiOperation({ summary: 'Update brand by slug param' })
  @ApiParam({
    name: 'slug',
    type: String,
    example: 'example-slug',
    required: true,
  })
  @ApiBody({ type: UpdateBrandDto })
  @ApiOkResponse({ type: Brand })
  @Patch(':slug')
  update(@Param('slug') slug: string, @Body() updateBrandDto: UpdateBrandDto) {
    return this.brandsService.update(slug, updateBrandDto);
  }

  @ApiOperation({ summary: 'Delete brand by id' })
  @ApiOkResponse({ type: Brand })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.brandsService.remove(+id);
  }
}
