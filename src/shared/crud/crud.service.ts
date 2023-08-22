import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';

interface Param<T> {
  name: keyof T;
  value: any;
}

@Injectable()
export class CrudService<T> {
  constructor(
    private readonly repository: Repository<T>,
    private readonly entityManager: EntityManager,
  ) {}

  async create(entity: T): Promise<T> {
    return await this.repository.save(entity);
  }

  async readOne(param: Param<T>): Promise<T> {
    return this.repository.findOne({
      where: {
        [param.name]: param.value,
      } as any,
    });
  }
}
