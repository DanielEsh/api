import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  DefaultValuePipe,
  Query,
  ParseArrayPipe,
  ParseIntPipe,
  UsePipes,
  ValidationPipe,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { Product } from './entities/product.entity';

const DEFAULT_VALUES = {
  limit: 10,
  page: 1,
  sort_by: [],
  order_by: [],
};

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @ApiOperation({ summary: 'Create product' })
  @ApiBody({ type: CreateProductDto })
  @ApiCreatedResponse({ type: Product })
  @Post()
  @UsePipes(new ValidationPipe())
  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    try {
      return this.productsService.create(createProductDto);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.CONFLICT);
    }
  }

  @Get()
  @ApiOperation({ summary: 'Read products' })
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
    return this.productsService.findAll({
      sortBy,
      orderBy,
      page,
      limit,
    });
  }

  @ApiOperation({ summary: 'Read product by id' })
  @ApiParam({
    name: 'id',
    type: Number,
    example: '1',
    required: true,
  })
  @ApiOkResponse({ type: Product })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(+id);
  }

  @ApiOperation({ summary: 'Update product by id' })
  @ApiParam({
    name: 'id',
    type: Number,
    example: '21',
    required: true,
  })
  @ApiBody({ type: UpdateProductDto })
  @ApiOkResponse({ type: Product })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(+id, updateProductDto);
  }

  @ApiOperation({ summary: 'Delete product by id' })
  @ApiOkResponse({ type: Product })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(+id);
  }
}
