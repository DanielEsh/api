import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CrudService, PaginationsParams } from 'src/shared/crud';

@Injectable()
export class CategoriesService {
  protected readonly crudService;

  constructor(
    @InjectRepository(Category)
    private readonly repository: Repository<Category>,
  ) {
    this.crudService = new CrudService<Category>(this.repository, 'categories');
  }

  async createCategory(createCategoryDto: CreateCategoryDto) {
    const categoryToCreate = new Category();

    categoryToCreate.slug = createCategoryDto.slug;
    categoryToCreate.name = createCategoryDto.name;
    categoryToCreate.description = createCategoryDto?.description || '';

    return await this.crudService.create(categoryToCreate);
  }

  async findAll(options: PaginationsParams) {
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
