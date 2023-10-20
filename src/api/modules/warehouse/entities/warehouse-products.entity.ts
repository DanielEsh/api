import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
} from 'typeorm';
import { Product } from '../../products/entities/product.entity';
import { Warehouse } from './warehouse.entity';

@Entity()
export class WarehouseProducts {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column({ type: 'int' })
  public quantity: number;

  @ManyToOne(() => Product, (product) => product.warehouses)
  @JoinColumn()
  product: Product;

  @ManyToOne(() => Warehouse, (warehouse) => warehouse.products)
  @JoinColumn()
  warehouse: Warehouse;
}
