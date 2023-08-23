import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
// import { CrudService } from 'src/shared/crud/crud.service';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

interface PaginationLinks {
  previous: number | null;
  next: number | null;
}
interface Pagination {
  itemCountOnPage: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
  links: PaginationLinks;
}

export interface Meta {
  totalItemsCount: number;
  pagination: Pagination;
}

interface FindAllOptions {
  sort: [string];
  order: ['asc' | 'desc'];
  limit: number;
  page: number;
  route: string;
}

@Injectable()
export class CategoriesService {
  @InjectRepository(Category)
  private readonly repository: Repository<Category>;

  private readonly queryBuilder = null;

  async createCategory(createCategoryDto: CreateCategoryDto) {
    const categoryToCreate = new Category();

    categoryToCreate.slug = createCategoryDto.slug;
    categoryToCreate.name = createCategoryDto.name;
    categoryToCreate.description = createCategoryDto?.description || '';

    return await this.repository.save(categoryToCreate);
  }

  async findAll(options: FindAllOptions) {
    const builder = await this.repository.createQueryBuilder('category');

    return this.paginate(builder, options);
  }

  private async paginate(builder, options: FindAllOptions) {
    const { limit = 10, page = 1 } = options;

    console.log('options', options);

    builder.limit(limit);
    builder.offset((page - 1) * limit);

    const totalItemsCount = await builder.getCount();
    const getBuilder = await builder
      .select('category.id')
      .addSelect('category.slug')
      .addSelect('category.name');

    if (options.sort) {
      options.sort.map((field, index) =>
        getBuilder.orderBy(
          `category.${field}`,
          options.order.length ? options.order[index]?.toUpperCase() : 'ASC',
        ),
      );
    }

    const items = await getBuilder.getMany();

    const totalPages =
      totalItemsCount !== undefined
        ? Math.ceil(totalItemsCount / limit)
        : undefined;
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;

    const routes = {
      previous: hasPreviousPage ? page - 1 : null,
      next: hasNextPage ? page + 1 : null,
    };

    const meta: Meta = {
      totalItemsCount,
      pagination: {
        itemCountOnPage: items.length,
        itemsPerPage: limit,
        totalPages,
        currentPage: page,
        links: {
          previous: routes.previous,
          next: routes.next,
        },
      },
    };

    return {
      data: items,
      meta,
    };
  }

  findOneBySlug(slug: string) {
    return this.repository.findOne({ where: { slug } });
  }

  findOneById(id: number) {
    return this.repository.findOne({ where: { id } });
  }

  async update(slug: string, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.findOneBySlug(slug);

    category.name = updateCategoryDto?.name ?? category.name;
    category.description =
      updateCategoryDto?.description ?? category.description;

    return this.repository.save(category);
  }

  async remove(id: number) {
    const deletedEntity = await this.findOneById(id);
    if (!deletedEntity) {
      throw new NotFoundException();
    }

    await this.repository.remove(deletedEntity);
    return deletedEntity;
  }
}
