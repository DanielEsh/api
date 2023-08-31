import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Product } from '../../products/entities/product.entity';

@Entity()
export class Brand {
  @ApiProperty({
    example: 1,
    description: 'The unique identifier for the brand',
  })
  @PrimaryGeneratedColumn()
  public id!: number;

  @ApiProperty({
    example: 'example-slug',
    description: 'The unique slug for the brand',
  })
  @Column({ type: 'varchar', unique: true })
  public slug: string;

  @ApiProperty({
    example: 'example name',
    description: 'Name for the brand',
  })
  @Column({ type: 'varchar' })
  public name: string;

  @ApiProperty({
    example: '',
    description: 'brand description',
    required: false,
  })
  @Column({ type: 'varchar', default: '' })
  public description: string;

  @OneToMany(() => Product, (product) => product.category)
  public products: Product[];

  @ApiProperty({
    description: 'created timestamp',
  })
  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  public created_at: Date;

  @ApiProperty({
    description: 'updated timestamp',
  })
  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  public updated_at: Date;
}
