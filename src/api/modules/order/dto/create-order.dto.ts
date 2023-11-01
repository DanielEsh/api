import { OrderPaymentStatus } from '../order-payment-status.enum';
import { Product } from '../../products/entities/product.entity';

export interface CreatedOrderProducts {
  id: Product['id'];
  count: number;
}

export class CreateOrderDto {
  payment_status: OrderPaymentStatus;
  name: string;
  email: string;
  phone: number;
  comment: string;
  products: CreatedOrderProducts[];
}
