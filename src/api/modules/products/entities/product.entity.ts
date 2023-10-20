import {
  BaseEntity,
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  JoinTable,
} from 'typeorm';
import { Brand } from '../../brands/entities/brand.entity';
import { Category } from '../../categories/entities/category.entity';
import { ProductAttributeGroup } from './product-attribute-group.entity';
import { WarehouseProducts } from '../../warehouse/entities/warehouse-products.entity';

@Entity()
export class Product extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column({ type: 'varchar' })
  public article: string;

  @Column({ type: 'varchar' })
  public name: string;

  @Column({ type: 'int' })
  public price: number;

  @Column({ type: 'text', nullable: true })
  public description?: string;

  @ManyToOne(() => Category, (category) => category.products)
  public category: Category;

  @ManyToOne(() => Brand, (brand) => brand.products)
  public brand: Brand;

  @Column({ type: 'jsonb', nullable: true, default: [] })
  public attributeGroup: ProductAttributeGroup[];

  @ManyToMany(
    () => WarehouseProducts,
    (warehouseProducts) => warehouseProducts.product,
  )
  @JoinTable()
  public warehouses: WarehouseProducts[];
}
