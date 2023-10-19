import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Warehouse {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar' })
  address: string;
}
