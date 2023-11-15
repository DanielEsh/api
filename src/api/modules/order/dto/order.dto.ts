import { OrderPaymentStatus } from '../order-payment-status.enum';
import { OrderStatus } from '../order-status.enum';
import { Warehouse } from '../../warehouse/entities/warehouse.entity';
import { Staff } from '../../staff/entity/staff.entity';

interface UserDetails {
  name: string;
  email: string;
  phone: number;
  comment: string;
}

export interface OrderDto {
  id: number;
  number: string;
  payment_status: OrderPaymentStatus;
  status: OrderStatus;
  user_details: UserDetails;
  warehouse: Warehouse;
  staff: Staff;
}
