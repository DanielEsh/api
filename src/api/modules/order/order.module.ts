import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderController } from './order.controller';
import { Order } from './entity/order.entity';
import { OrderService } from './order.service';
import { Warehouse } from '../warehouse/entities/warehouse.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Order, Warehouse])],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
