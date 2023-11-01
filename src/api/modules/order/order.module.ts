import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderController } from './order.controller';
import { Order } from './entity/order.entity';
import { OrderService } from './order.service';
import { Warehouse } from '../warehouse/entities/warehouse.entity';
import { Staff } from '../staff/entity/staff.entity';
import { Product } from '../products/entities/product.entity';
import { OrderProducts } from './entity/order-products.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, Warehouse, Staff, Product, OrderProducts]),
  ],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
