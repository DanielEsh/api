import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Product } from '../../products/entities/product.entity';
import { Order } from './order.entity';

@Entity()
export class OrderProducts {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column({ type: 'int' })
  public count: number;

  @ManyToOne(() => Product, (product) => product.order_products)
  @JoinColumn()
  product: Product;

  @ManyToOne(() => Order, (order) => order.products)
  @JoinColumn()
  order: Order;
}
