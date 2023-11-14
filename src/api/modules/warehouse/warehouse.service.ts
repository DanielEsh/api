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
    return await this.crudService.readOne({
      name: 'id',
      value: id,
    });
  }

  async getProductsByWarehouseId(
    warehouseId: number,
    page: number = 1,
    pageSize: number = 10,
  ) {
    const options: PaginationsParams = {
      page,
      limit: pageSize,
    };

    const [data, totalCount] =
      await this.warehouseProductsRepository.findAndCount({
        where: {
          warehouse: {
            id: warehouseId,
          },
        },
        relations: ['product'],
        skip: (page - 1) * pageSize,
        take: pageSize,
        order: this.constructOrderBy(options),
      });

    return this.formatPageableResponse(data, totalCount, options);
  }

  private constructOrderBy(options: PaginationsParams): {
    [key: string]: 'ASC' | 'DESC';
  } {
    const { sortBy, orderBy } = options;
    const order: { [key: string]: 'ASC' | 'DESC' } = {};

    if (sortBy?.length && orderBy?.length) {
      sortBy.forEach((field, index) => {
        order[field] = orderBy[index].toUpperCase() as 'ASC' | 'DESC';
      });
    }

    return order;
  }

  private formatPageableResponse(
    data: any[],
    totalCount: number,
    options: PaginationsParams,
  ) {
    const { page, limit } = options;

    const totalPages = Math.ceil(totalCount / limit);

    return {
      content: data,
      meta: {
        totalItemsCount: totalCount,
        pagination: {
          itemsCountOnPage: data.length,
          itemsPerPage: limit,
          totalPages,
          page,
          links: {
            previous: page > 1 ? page - 1 : null,
            next: page < totalPages ? page + 1 : null,
          },
        },
      },
    };
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

    if (updateWarehouseDto?.products) {
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
