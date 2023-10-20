import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Warehouse } from './entities/warehouse.entity';
import { CreateWarehouseDto } from './dto/create-warehouse.dto';
import {
  CrudService,
  ICrudService,
  PaginationsParams,
} from '../../../shared/crud';
import { UpdateWarehouseDto } from './dto/update-warehouse.dto';
import { WarehouseProducts } from './entities/warehouse-products.entity';

@Injectable()
export class WarehouseService {
  protected readonly crudService: ICrudService<Warehouse>;
  constructor(
    @InjectRepository(Warehouse)
    private warehouseRepository: Repository<Warehouse>,

    @InjectRepository(WarehouseProducts)
    private warehouseProductsRepository: Repository<WarehouseProducts>,
  ) {
    this.crudService = new CrudService<Warehouse>(
      this.warehouseRepository,
      'warehouse',
    );
  }
  async create(createWarehouseDto: CreateWarehouseDto) {
    const newWarehouse = new Warehouse();

    newWarehouse.name = createWarehouseDto.name;
    newWarehouse.address = createWarehouseDto.address ?? '';

    return this.warehouseRepository.save(newWarehouse);
  }

  async findAll(options: PaginationsParams) {
    return await this.crudService.readAll(options);
  }

  async findOneById(id: number) {
    const warehouse = await this.crudService.readOne({
      name: 'id',
      value: id,
    });

    warehouse.products = await this.warehouseProductsRepository.find({
      where: {
        warehouse: {
          id: warehouse.id,
        },
      },
      relations: ['product'],
    });

    return warehouse;
  }

  async update(id: number, updateWarehouseDto: UpdateWarehouseDto) {
    const updatedWarehouse = await this.findOneById(id);

    updatedWarehouse.name = updateWarehouseDto.name;
    updatedWarehouse.address =
      updateWarehouseDto.address ?? updatedWarehouse.address;

    return await this.warehouseRepository.save(updatedWarehouse);
  }

  async remove(id: number) {
    return await this.crudService.delete({
      name: 'id',
      value: id,
    });
  }
}
