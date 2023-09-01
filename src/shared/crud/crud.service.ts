import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  OrderType,
  PageableResponse,
  PaginationsParams,
} from './paginations.types';

interface Param<T> {
  name: keyof T;
  value: any;
}

export interface JoinedEntitiesMapper {
  entity: string;
  fields: string[];
}

export interface ICrudService<T> {
  create(entity: T): Promise<T>;
  readAll(
    options: PaginationsParams,
    joinedEntitiesMapper?: JoinedEntitiesMapper[],
  ): Promise<PageableResponse<T>>;
  readOne(
    param: Param<T>,
    joinedEntitiesMapper?: JoinedEntitiesMapper[],
  ): Promise<T>;
  readOneById(id: number): Promise<T>;
  findByParam(
    param: Param<T>,
    joinedEntitiesMapper?: JoinedEntitiesMapper[],
  ): Promise<T>;
  update(findEntityParam: Param<T>, updatedData: Partial<T>): Promise<T>;
  delete(findEntityParam: Param<T>): Promise<T>;
}

@Injectable()
export class CrudService<T> implements ICrudService<T> {
  constructor(
    @InjectRepository(Object) private readonly repository: Repository<T>,
    private readonly entityName: string,
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

  async readAll(
    options: PaginationsParams,
    joinedEntitiesMapper: JoinedEntitiesMapper[] = [],
  ): Promise<PageableResponse<T>> {
    const { page, limit, sortBy, orderBy } = options;
    const queryBuilder = this.repository.createQueryBuilder(this.entityName);

    if (joinedEntitiesMapper.length) {
      joinedEntitiesMapper.forEach((joinedObj) => {
        const { entity, fields } = joinedObj;

        if (fields) {
          queryBuilder.leftJoin(
            `${this.entityName}.${entity}`,
            joinedObj.entity,
          );

          fields.forEach((field) => {
            queryBuilder.addSelect(`${entity}.${field}`);
          });
        }
      });
    }

    const offset = (page - 1) * limit;

    if (sortBy?.length && orderBy?.length) {
      const order = orderBy.map((item) => item.toUpperCase()) as OrderType;

      sortBy.map((field, index) =>
        queryBuilder.orderBy(`${this.entityName}.${field}`, order[index]),
      );
    }

    const [data, totalCount] = await queryBuilder
      .offset(offset)
      .limit(limit)
      .getManyAndCount();

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

  async readOne(
    param: Param<T>,
    joinedEntitiesMapper: JoinedEntitiesMapper[] = [],
  ): Promise<T> {
    return await this.findByParam(param, joinedEntitiesMapper);
  }

  async readOneById(id: number) {
    return await this.findByParam({
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      name: 'id',
      value: id,
    });
  }

  async findByParam(
    param: Param<T>,
    joinedEntitiesMapper: JoinedEntitiesMapper[] = [],
  ): Promise<T> {
    const queryBuilder = this.repository.createQueryBuilder(this.entityName);

    if (joinedEntitiesMapper.length) {
      joinedEntitiesMapper.forEach((joinedObj) => {
        const { entity, fields } = joinedObj;

        if (fields) {
          queryBuilder.leftJoin(
            `${this.entityName}.${entity}`,
            joinedObj.entity,
          );

          fields.forEach((field) => {
            queryBuilder.addSelect(`${entity}.${field}`);
          });
        }
      });
    }

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    queryBuilder.where(`${this.entityName}.${param.name} = ${param.value}`);

    const entity = await queryBuilder.getOne();

    if (!entity) {
      throw new NotFoundException(`Entity not found`);
    }

    return entity;
  }

  async update(findEntityParam: Param<T>, updatedData: Partial<T>): Promise<T> {
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
