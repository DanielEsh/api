import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseArrayPipe,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { WarehouseService } from './warehouse.service';
import { CreateWarehouseDto } from './dto/create-warehouse.dto';
import { UpdateWarehouseDto } from './dto/update-warehouse.dto';

const DEFAULT_VALUES = {
  limit: 10,
  page: 1,
  sort_by: [],
  order_by: [],
};

@Controller('warehouse')
export class WarehouseController {
  constructor(private readonly warehouseService: WarehouseService) {}
  @Post()
  create(@Body() createWarehouseDto: CreateWarehouseDto) {
    try {
      return this.warehouseService.create(createWarehouseDto);
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
    sortBy,
    @Query(
      'order_by',
      new DefaultValuePipe(DEFAULT_VALUES.order_by),
      ParseArrayPipe,
    )
    orderBy,
  ) {
    return this.warehouseService.findAll({
      sortBy,
      orderBy,
      page,
      limit,
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.warehouseService.findOneById(+id);
  }

  @Post(':id/products')
  createWarehouseProducts(@Param('id') id: string, @Body() createdDto: any) {
    return this.warehouseService.createWarehouseProduct(+id, createdDto);
  }

  @Get(':id/products')
  getWarehouseProducts(
    @Param('id') id: string,
    @Query('page', new DefaultValuePipe(DEFAULT_VALUES.page), ParseIntPipe)
    page,
    @Query('limit', new DefaultValuePipe(DEFAULT_VALUES.limit), ParseIntPipe)
    limit,
  ) {
    return this.warehouseService.getProductsByWarehouseId(+id, page, limit);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateWarehouseDto: UpdateWarehouseDto,
  ) {
    return this.warehouseService.update(+id, updateWarehouseDto);
  }

  @Delete(':id/products/:id')
  removeWarehouseProduct(@Param('id') warehouseProductId: string) {
    return this.warehouseService.removeWarehouseProduct(+warehouseProductId);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.warehouseService.remove(+id);
  }
}
