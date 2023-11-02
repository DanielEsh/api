import {
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { OrderPaymentStatus } from '../order-payment-status.enum';
import { OrderStatus } from '../order-status.enum';
import { Warehouse } from '../../warehouse/entities/warehouse.entity';
import { Staff } from '../../staff/entity/staff.entity';
import { OrderProducts } from './order-products.entity';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ type: 'varchar', unique: true })
  public number: string;

  @Column({
    type: 'enum',
    enum: OrderPaymentStatus,
    default: OrderPaymentStatus.UNSPECIFIED,
  })
  payment_status: OrderPaymentStatus;

  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.NEW })
  status: OrderStatus;

  @Column({ type: 'varchar' })
  public name: string;

  @Column({ type: 'varchar' })
  public email: string;

  @Column({ type: 'bigint' })
  public phone: number;

  @Column({ type: 'varchar' })
  public comment: string;

  @Column({ type: 'bigint' })
  public total_price: number;

  @ManyToOne(() => Warehouse, { nullable: true })
  warehouse: Warehouse;

  @ManyToOne(() => Staff, { nullable: true })
  staff: Staff;

  @ManyToMany(() => OrderProducts, (orderProducts) => orderProducts.order)
  products: OrderProducts[];
}
