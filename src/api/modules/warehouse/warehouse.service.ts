import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Warehouse } from './entities/warehouse.entity';
import { CreateWarehouseDto } from './dto/create-warehouse.dto';
import {
  CrudService,
  ICrudService,
  PaginationsParams,
} from '../../../shared/crud';

@Injectable()
export class WarehouseService {
  protected readonly crudService: ICrudService<Warehouse>;
  constructor(
    @Inject(Warehouse)
    private warehouseRepository: Repository<Warehouse>,
  ) {
    this.crudService = new CrudService<Warehouse>(
      this.warehouseRepository,
      'warehouse',
    );
  }
  async create(createWarehouseDto: CreateWarehouseDto) {
    const newWarehouse = new Warehouse();

    newWarehouse.name = createWarehouseDto.name;
    newWarehouse.address = createWarehouseDto.address;

    return this.warehouseRepository.save(newWarehouse);
  }

  async findAll(options: PaginationsParams) {
    return await this.crudService.readAll(options);
  }

  async findOne(id: number) {
    return await this.crudService.readOne({
      name: 'id',
      value: id,
    });
  }
}
