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
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { RoleService } from './role.service';
import { RoleCrateDto } from './dto/role-crate.dto';
import { RoleEntity } from './entity/role.entity';
import { Brand } from '../brands/entities/brand.entity';
import { RoleUpdateDto } from './dto/role-update.dto';

const DEFAULT_VALUES = {
  limit: 10,
  page: 1,
  sort_by: [],
  order_by: [],
};

@ApiTags('roles')
@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @ApiOperation({ summary: 'Create role' })
  @ApiBody({ type: RoleCrateDto })
  @ApiCreatedResponse({ type: RoleEntity })
  @Post()
  create(@Body() roleCreateDto: RoleCrateDto) {
    try {
      return this.roleService.create(roleCreateDto);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.CONFLICT);
    }
  }

  @ApiOperation({ summary: 'Read roles' })
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
    return this.roleService.findAll({
      sortBy,
      orderBy,
      page,
      limit,
    });
  }

  @ApiOperation({ summary: 'Read role by id' })
  @ApiParam({
    name: 'id',
    type: Number,
    example: 1,
    required: true,
  })
  @ApiOkResponse({ type: Brand })
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.roleService.findById(id);
  }

  @ApiOperation({ summary: 'Update role by id' })
  @ApiParam({
    name: 'id',
    type: Number,
    example: 1,
    required: true,
  })
  @ApiBody({ type: RoleUpdateDto })
  @ApiOkResponse({ type: RoleEntity })
  @Patch(':id')
  update(@Param('id') id: number, @Body() roleUpdateDto: RoleUpdateDto) {
    return this.roleService.updateById(id, roleUpdateDto);
  }

  @ApiOperation({ summary: 'Delete role by id' })
  @ApiOkResponse({ type: RoleEntity })
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.roleService.remove(+id);
  }
}
