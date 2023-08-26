import { Injectable } from '@nestjs/common';
import { CreateAttributeDto } from './dto/create-attribute.dto';
import { UpdateAttributeDto } from './dto/update-attribute.dto';
import { CrudService, ICrudService, PaginationsParams } from 'src/shared/crud';
import { Attribute } from './entities/attribute.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AttributesService {
  protected readonly crudService: ICrudService<Attribute>;

  constructor(
    @InjectRepository(Attribute)
    private readonly attributeRepository: Repository<Attribute>,
  ) {
    this.crudService = new CrudService<Attribute>(
      this.attributeRepository,
      'attributes',
    );
  }

  async create(createAttributeDto: CreateAttributeDto) {
    const attributeToCreate = new Attribute();

    attributeToCreate.name = createAttributeDto.name;
    attributeToCreate.type = createAttributeDto.type;
    attributeToCreate.value = createAttributeDto.value;
    attributeToCreate.description = createAttributeDto?.description || '';

    return await this.crudService.create(attributeToCreate);
  }

  async readAll(options: PaginationsParams) {
    return await this.crudService.readAll(options);
  }

  async readOneById(id: number) {
    return await this.crudService.readOneById(id);
  }

  async update(id: number, updateAttributeDto: UpdateAttributeDto) {
    return await this.crudService.update(
      { name: 'id', value: id },
      updateAttributeDto,
    );
  }

  async remove(id: number) {
    return await this.crudService.delete({
      name: 'id',
      value: id,
    });
  }
}
