import {
  Body,
  Controller,
  DefaultValuePipe,
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
import { StaffService } from './staff.service';
import { CreateStaffDto } from './dto/create-staff.dto';
import { UpdateOrderDto } from '../order/dto/update-order.dto';

const DEFAULT_VALUES = {
  limit: 10,
  page: 1,
  sort_by: [],
  order_by: [],
};

@Controller('staff')
export class StaffController {
  constructor(private readonly staffService: StaffService) {}

  @Post()
  create(@Body() createStaffDto: CreateStaffDto) {
    try {
      return this.staffService.create(createStaffDto);
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
    return this.staffService.findAll({
      sortBy,
      orderBy,
      page,
      limit,
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.staffService.findOneById(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string) {
    return this.staffService.update(+id, {});
  }
}
