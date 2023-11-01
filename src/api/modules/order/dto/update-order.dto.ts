import { PartialType } from '@nestjs/swagger';
import { CreateOrderDto } from './create-order.dto';
import { OrderStatus } from '../order-status.enum';
import { Staff } from '../../staff/entity/staff.entity';

export class UpdateOrderDto extends PartialType(CreateOrderDto) {
  warehouse: number;
  status: OrderStatus;
  staff: Staff['id'];
}
