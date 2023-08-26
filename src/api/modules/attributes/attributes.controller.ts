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
  Query,
  ParseIntPipe,
  ParseArrayPipe,
} from '@nestjs/common';
import { AttributesService } from './attributes.service';
import { CreateAttributeDto } from './dto/create-attribute.dto';
import { UpdateAttributeDto } from './dto/update-attribute.dto';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { Attribute } from './entities/attribute.entity';
import { Brand } from '../brands/entities/brand.entity';

const DEFAULT_VALUES = {
  limit: 10,
  page: 1,
  sort_by: [],
  order_by: [],
};

@ApiTags('attributes')
@Controller('attributes')
export class AttributesController {
  constructor(private readonly attributesService: AttributesService) {}

  @ApiOperation({ summary: 'Create attribute' })
  @ApiBody({ type: CreateAttributeDto })
  @ApiCreatedResponse({ type: Attribute })
  @Post()
  @UsePipes(new ValidationPipe())
  create(@Body() createAttributeDto: CreateAttributeDto) {
    try {
      return this.attributesService.create(createAttributeDto);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.CONFLICT);
    }
  }

  @ApiOperation({ summary: 'Read attributes' })
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
    return this.attributesService.readAll({
      sortBy,
      orderBy,
      page,
      limit,
    });
  }

  @ApiOperation({ summary: 'Read attribute by id' })
  @ApiParam({
    name: 'id',
    type: Number,
    example: 1,
    required: true,
  })
  @ApiOkResponse({ type: Brand })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.attributesService.readOneById(+id);
  }

  @ApiOperation({ summary: 'Update attribute by id' })
  @ApiParam({
    name: 'id',
    type: Number,
    example: 1,
    required: true,
  })
  @ApiBody({ type: UpdateAttributeDto })
  @ApiOkResponse({ type: Brand })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateAttributeDto: UpdateAttributeDto,
  ) {
    return this.attributesService.update(+id, updateAttributeDto);
  }

  @ApiOperation({ summary: 'Delete attribute by id' })
  @ApiOkResponse({ type: Brand })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.attributesService.remove(+id);
  }
}
