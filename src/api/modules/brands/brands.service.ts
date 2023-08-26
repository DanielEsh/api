import { Injectable } from '@nestjs/common';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { Brand } from './entities/brand.entity';
import { Repository } from 'typeorm';
import {
  CrudService,
  type PaginationsParams,
  type ICrudService,
} from 'src/shared/crud';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class BrandsService {
  protected readonly crudService: ICrudService<Brand>;

  constructor(
    @InjectRepository(Brand)
    private readonly brandRepository: Repository<Brand>,
  ) {
    this.crudService = new CrudService<Brand>(this.brandRepository, 'brands');
  }

  async create(createBrandDto: CreateBrandDto) {
    const brandToCreate = new Brand();

    brandToCreate.slug = createBrandDto.slug;
    brandToCreate.name = createBrandDto.name;
    brandToCreate.description = createBrandDto?.description || '';

    return await this.crudService.create(brandToCreate);
  }

  async findAll(options: PaginationsParams) {
    return await this.crudService.readAll(options);
  }

  async findOneBySlug(slug: string) {
    return await this.crudService.readOne({
      name: 'slug',
      value: slug,
    });
  }

  async findOneById(id: number) {
    return await this.crudService.readOne({
      name: 'id',
      value: id,
    });
  }

  async update(slug: string, updateBrandDto: UpdateBrandDto) {
    return await this.crudService.update(
      { name: 'slug', value: slug },
      updateBrandDto,
    );
  }

  async remove(id: number) {
    return await this.crudService.delete({
      name: 'id',
      value: id,
    });
  }
}
