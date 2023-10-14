import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class RoleEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column({ type: 'varchar', nullable: false })
  public name: string | null;

  // TODO: fix any
  @Column({ type: 'jsonb', nullable: true, default: [] })
  public permissions: any[];
}
