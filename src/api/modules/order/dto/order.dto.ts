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

interface DelivaryDetails {
  country: string;
  city: string;
  street: string;
  house: string;
  building: string;
  apartment_office: string;
  zip_code: string;
}

export interface OrderDto {
  id: number;
  number: string;
  payment_status: OrderPaymentStatus;
  status: OrderStatus;
  user_details: UserDetails;
  delivery_details: DelivaryDetails;
  warehouse: Warehouse;
  staff: Staff;
}
