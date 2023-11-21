import { OrderPaymentStatus } from '../order-payment-status.enum';
import { Product } from '../../products/entities/product.entity';
import { OrderStatus } from '../order-status.enum';
import { Warehouse } from '../../warehouse/entities/warehouse.entity';
import { Staff } from '../../staff/entity/staff.entity';

export interface CreatedOrderProducts {
  id: Product['id'];
  count: number;
}

interface UserDetails {
  firstName: string;
  lastName: string;
  middleName: string;
  email: string;
  phone: number;
  comment: string;
}

interface DeliveryDetails {
  country: string;
  city: string;
  street: string;
  house: string;
  building: string;
  apartment_office: string;
  zip_code: string;
}

export class CreateOrderDto {
  payment_status: OrderPaymentStatus;
  status: OrderStatus;
  user_details: UserDetails;
  delivery_details: DeliveryDetails;
  warehouse: Warehouse;
  staff: Staff;
  products: CreatedOrderProducts[];
}
