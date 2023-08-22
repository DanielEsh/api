import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

interface Param<T> {
  name: keyof T;
  value: any;
}

@Injectable()
export class CrudService<T> {
  constructor(private readonly repository: Repository<T>) {}

  async create(entity: T): Promise<T> {
    return await this.repository.save(entity);
  }

  async readAll(): Promise<T[]> {
    return this.repository.find();
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
