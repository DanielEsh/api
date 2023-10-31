import {
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { WarehouseProducts } from './warehouse-products.entity';
import { Order } from '../../order/entity/order.entity';

@Entity()
export class Warehouse {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar' })
  address: string;

  @ManyToMany(
    () => WarehouseProducts,
    (warehouseProducts) => warehouseProducts.warehouse,
  )
  products: WarehouseProducts[];

  @OneToMany(() => Order, (order) => order.warehouse)
  public order: Order[];
}
