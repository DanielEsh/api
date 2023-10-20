import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Warehouse } from './entities/warehouse.entity';
import { WarehouseService } from './warehouse.service';
import { WarehouseController } from './warehouse.controller';
import { WarehouseProducts } from './entities/warehouse-products.entity';
import { Product } from '../products/entities/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Warehouse, WarehouseProducts, Product])],
  controllers: [WarehouseController],
  providers: [WarehouseService],
})
export class WarehouseModule {}
