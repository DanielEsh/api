import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Warehouse } from './entities/warehouse.entity';
import { WarehouseService } from './warehouse.service';
import { WarehouseController } from './warehouse.controller';
import { WarehouseProducts } from './entities/warehouse-products.entity';
import { Product } from '../products/entities/product.entity';
import { ProductsModule } from '../products/products.module';
import { Order } from '../order/entity/order.entity';

@Module({
  imports: [
    ProductsModule,
    TypeOrmModule.forFeature([Warehouse, WarehouseProducts, Product, Order]),
  ],
  controllers: [WarehouseController],
  providers: [WarehouseService],
})
export class WarehouseModule {}
