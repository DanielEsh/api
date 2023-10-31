import { OrderPaymentStatus } from '../order-payment-status.enum';

export class CreateOrderDto {
  payment_status: OrderPaymentStatus;
  name: string;
  email: string;
  phone: number;
  comment: string;
}
