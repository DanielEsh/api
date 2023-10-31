import { PartialType } from '@nestjs/swagger';
import { CreateOrderDto } from './create-order.dto';
import { OrderStatus } from '../order-status.enum';

export class UpdateOrderDto extends PartialType(CreateOrderDto) {
  warehouse: number;
  status: OrderStatus;
}
