import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PageableResponse } from './paginations.types';

interface Param<T> {
  name: keyof T;
  value: any;
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

    const pagination: PageableResponse<T> = {
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
    return await this.findByParam(param);
  }

  async readOneById(id: number) {
    return await this.findByParam({
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      name: 'id',
      value: id,
    });
  }

  async findByParam(param: Param<T>): Promise<T> {
    const entity = await this.repository.findOne({
      where: {
        [param.name]: param.value,
      } as any,
    });

    if (!entity) {
      throw new NotFoundException('Entity not found');
    }

    return entity;
  }

  async updateById(
    findEntityParam: Param<T>,
    updatedData: Partial<T>,
  ): Promise<T> {
    const entityToUpdate = await this.readOne(findEntityParam);

    Object.assign(entityToUpdate, updatedData);

    return await this.repository.save(entityToUpdate);
  }

  async delete(findEntityParam: Param<T>): Promise<T> {
    const deletedEntity = await this.readOne(findEntityParam);

    await this.repository.remove(deletedEntity);
    return deletedEntity;
  }
}
