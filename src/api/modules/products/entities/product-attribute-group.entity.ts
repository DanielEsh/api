import {
  BaseEntity,
  Column,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Product } from './product.entity';
// import { Attribute } from '../../attributes/entities/attribute.entity';

export interface AttributesGroupAttribute {
  attributeId: number;
  value: string;
}

@Entity()
export class ProductAttributeGroup extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column({ type: 'varchar' })
  public name: string;

  @ManyToMany(() => Product, (product) => product.attributeGroup)
  public product: Product;

  @Column({ type: 'jsonb', nullable: true, default: [] })
  public attributes: AttributesGroupAttribute[];

  // @ManyToMany(() => Attribute, (attribute) => attribute.attributeGroups)
  // public attributes: Attribute[];
}
