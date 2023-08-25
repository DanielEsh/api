import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
// import { CrudService } from 'src/shared/crud/crud.service';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CrudService } from 'src/shared/crud/crud.service';

interface FindAllOptions {
  sort: [string];
  order: ['asc' | 'desc'];
  limit: number;
  page: number;
}

@Injectable()
export class CategoriesService {
  protected readonly crudService;

  constructor(
    @InjectRepository(Category)
    private readonly repository: Repository<Category>,
  ) {
    this.crudService = new CrudService<Category>(repository, 'categories');
  }

  async createCategory(createCategoryDto: CreateCategoryDto) {
    const categoryToCreate = new Category();

    categoryToCreate.slug = createCategoryDto.slug;
    categoryToCreate.name = createCategoryDto.name;
    categoryToCreate.description = createCategoryDto?.description || '';

    return await this.crudService.create(categoryToCreate);
  }

  async findAll(options: FindAllOptions) {
    return await this.crudService.findPaginationAll(
      options.page,
      options.limit,
    );
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

  async update(slug: string, updateCategoryDto: UpdateCategoryDto) {
    return await this.crudService.updateById(
      { name: 'slug', value: slug },
      updateCategoryDto,
    );
  }

  async remove(id: number) {
    return await this.crudService.delete({
      name: 'id',
      value: id,
    });
  }
}
