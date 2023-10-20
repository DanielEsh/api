import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Warehouse } from './entities/warehouse.entity';
import { CreateWarehouseDto } from './dto/create-warehouse.dto';
import {
  CrudService,
  ICrudService,
  PaginationsParams,
} from '../../../shared/crud';
import { UpdateWarehouseDto } from './dto/update-warehouse.dto';
import { WarehouseProducts } from './entities/warehouse-products.entity';
import { ProductsService } from '../products/products.service';

@Injectable()
export class WarehouseService {
  protected readonly crudService: ICrudService<Warehouse>;
  constructor(
    @InjectRepository(Warehouse)
    private warehouseRepository: Repository<Warehouse>,

    @InjectRepository(WarehouseProducts)
    private warehouseProductsRepository: Repository<WarehouseProducts>,
    private entityManager: EntityManager,
    private productService: ProductsService,
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

    await this.warehouseRepository.save(newWarehouse);

    if (createWarehouseDto?.products?.length) {
      for (const productData of createWarehouseDto.products) {
        const product = await this.productService.findOne(
          productData.productId,
        );

        if (!product) {
          throw new NotFoundException();
        }

        const newWarehouseProduct = new WarehouseProducts();

        newWarehouseProduct.product = product;
        newWarehouseProduct.warehouse = newWarehouse;
        newWarehouseProduct.quantity = productData.quantity;

        await this.warehouseProductsRepository.save(newWarehouseProduct);
      }
    }

    return newWarehouse;
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

  private async updateWarehouseProducts(
    warehouse: Warehouse,
    updatedProductsData: UpdateWarehouseDto['products'],
  ) {
    await this.entityManager
      .createQueryBuilder()
      .delete()
      .from(WarehouseProducts)
      .where('warehouse.id = :warehouseId', { warehouseId: warehouse.id })
      .execute();

    for (const productData of updatedProductsData) {
      const product = await this.productService.findOne(productData.productId);

      const newWarehouseProduct = this.warehouseProductsRepository.create({
        product,
        warehouse: warehouse,
        quantity: productData.quantity,
      });
      await this.warehouseProductsRepository.save(newWarehouseProduct);
    }
  }

  async update(id: number, updateWarehouseDto: UpdateWarehouseDto) {
    const warehouse = await this.warehouseRepository.findOne({
      where: {
        id,
      },
    });

    warehouse.name = updateWarehouseDto.name;
    warehouse.address = updateWarehouseDto.address ?? warehouse.address;

    const updateWarehouse = await this.warehouseRepository.save(warehouse);

    if (updateWarehouseDto?.products?.length) {
      await this.updateWarehouseProducts(
        updateWarehouse,
        updateWarehouseDto.products,
      );
    }

    return updateWarehouse;
  }

  async remove(id: number) {
    return await this.crudService.delete({
      name: 'id',
      value: id,
    });
  }
}
