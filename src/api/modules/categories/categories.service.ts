import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
// import { CrudService } from 'src/shared/crud/crud.service';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('categories')
@Injectable()
export class CategoriesService {
  @InjectRepository(Category)
  private readonly repository: Repository<Category>;

  @ApiOperation({ summary: 'Create category' })
  @ApiBody({ type: CreateCategoryDto })
  async createCategory(createCategoryDto: CreateCategoryDto) {
    const categoryToCreate = new Category();

    categoryToCreate.slug = createCategoryDto.slug;
    categoryToCreate.name = createCategoryDto.name;
    categoryToCreate.description = createCategoryDto?.description || '';

    return await this.repository.save(categoryToCreate);
  }

  findAll() {
    return `This action returns all categories`;
  }

  findOne(slug: string) {
    return this.repository.findOne({ where: { slug } });
  }

  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return `This action updates a #${id} category`;
  }

  remove(id: number) {
    return `This action removes a #${id} category`;
  }
}
