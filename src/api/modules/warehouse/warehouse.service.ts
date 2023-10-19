import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Warehouse } from './entities/warehouse.entity';
import { CreateWarehouseDto } from './dto/create-warehouse.dto';

@Injectable()
export class WarehouseService {
  constructor(
    @Inject('PHOTO_REPOSITORY')
    private warehouseRepository: Repository<Warehouse>,
  ) {}
  async create(createWarehouseDto: CreateWarehouseDto) {
    const newWarehouse = new Warehouse();

    newWarehouse.name = createWarehouseDto.name;
    newWarehouse.address = createWarehouseDto.address;

    return this.warehouseRepository.save(newWarehouse);
  }
}
