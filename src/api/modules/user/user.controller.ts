import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Request,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
  ParseArrayPipe,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { UserCreateDto } from './dto/user-create.dto';
import { UserUpdateDto } from './dto/user-update.dto';
import { CreateProductDto } from '../products/dto/create-product.dto';

const DEFAULT_VALUES = {
  limit: 10,
  page: 1,
  sort_by: [],
  order_by: [],
};
@ApiTags('users')
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}
  @ApiOperation({ summary: 'Create user' })
  @ApiBody({ type: CreateProductDto })
  @Post('')
  async create(@Body() body: UserCreateDto) {
    return await this.userService.create(body);
  }

  @Get()
  @ApiOperation({ summary: 'Read users' })
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
    return this.userService.findAll({
      sortBy,
      orderBy,
      page,
      limit,
    });
  }

  @Put(':id')
  async updateById(@Param('id') id: number, @Body() body: UserUpdateDto) {
    return await this.userService.updateUserById(id, body);
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: number) {
    return await this.userService.delete(id);
  }

  @Get('/guest/')
  guest() {
    return 'Guest route';
  }

  @Get('admin')
  admin(@Request() req) {
    const { user } = req;
    return 'Admin route';
  }

  @Get(':id')
  getById(@Param('id') id: number) {
    return this.userService.findById(id);
  }
}
