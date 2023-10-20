import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { WarehouseProducts } from './warehouse-products.entity';

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
}
