import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

interface Param<T> {
  name: keyof T;
  value: any;
}

interface PaginationLinks {
  previous: number | null;
  next: number | null;
}
interface Pagination {
  itemsCountOnPage: number;
  itemsPerPage: number;
  totalPages: number;
  page: number;
  links: PaginationLinks;
}

export interface Meta {
  totalItemsCount: number;
  pagination: Pagination;
}

interface PagiableResponse<ENTITY> {
  content: ENTITY[];
  meta: Meta;
}

@Injectable()
export class CrudService<T> {
  constructor(
    @InjectRepository(Object) private readonly repository: Repository<T>,
  ) {}

  async create(entity: T): Promise<T> {
    try {
      return await this.repository.save(entity);
    } catch (error) {
      if (error.code === '23505')
        throw new ConflictException('Entity already exist');

      throw error;
    }
  }

  async readAll(): Promise<T[]> {
    return this.repository.find();
  }

  async findPaginationAll(page: number = 1, limit = 10) {
    const [data, totalCount] = await this.repository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
    });

    const totalPages = Math.ceil(totalCount / limit);

    const pagination: PagiableResponse<T> = {
      content: data,
      meta: {
        totalItemsCount: totalCount,
        pagination: {
          itemsCountOnPage: data.length,
          itemsPerPage: limit,
          totalPages,
          page: page,
          links: {
            previous: page > 1 ? page - 1 : null,
            next: page < totalPages ? page + 1 : null,
          },
        },
      },
    };

    return pagination;
  }

  async readOne(param: Param<T>): Promise<T> {
    return this.repository.findOne({
      where: {
        [param.name]: param.value,
      } as any,
    });
  }

  async updateById(id: number, entity: any) {
    await this.repository.update(id, entity);
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }
}
