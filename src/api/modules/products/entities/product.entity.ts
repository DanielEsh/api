import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Brand } from '../../brands/entities/brand.entity';
import { Category } from '../../categories/entities/category.entity';
import { ProductAttributeGroup } from './product-attribute-group.entity';

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

  @Column('jsonb', { array: true, nullable: true })
  public attributeGroup: ProductAttributeGroup[];
}
