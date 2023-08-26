import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { AttributeType } from '../attributes.types';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Attribute {
  @ApiProperty({
    example: 1,
    description: 'The unique identifier for the attribute',
  })
  @PrimaryGeneratedColumn()
  public id!: number;

  @ApiProperty({
    example: 'attribute name',
    description: 'Name for the attribute',
  })
  @Column({ type: 'varchar' })
  public name: string;

  @ApiProperty({
    example: 'attribute value',
    description: 'Value for the attribute',
    required: false,
  })
  @Column({ type: 'jsonb', nullable: true })
  public value?: any;

  @ApiProperty({
    example: '',
    description: 'attribute description',
    required: false,
  })
  @Column({ type: 'varchar', default: '' })
  public description?: string;

  @ApiProperty({
    enum: AttributeType,
    description: 'attribute description',
  })
  @Column({ type: 'jsonb', default: AttributeType.String })
  public type: AttributeType;

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
