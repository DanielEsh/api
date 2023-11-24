import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Order } from '../../order/entity/order.entity';

@Entity()
export class Staff {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ type: 'varchar', unique: true })
  public nickname: string;

  @Column({ type: 'varchar' })
  public first_name: string;

  @Column({ type: 'varchar' })
  public last_name: string;

  @Column({ type: 'varchar', nullable: true })
  public middle_name: string;

  @Column({ type: 'bigint', nullable: true })
  public phone: number;

  @Column({ type: 'varchar', unique: true })
  public email: string;

  @Column({ type: 'varchar' })
  public password: string;

  @Column({ type: 'timestamp', nullable: true, default: null })
  public lastLoginAt: Date | null;

  @Column({ type: 'varchar', nullable: true, default: null })
  public hashedRefreshToken: string | null;

  @OneToMany(() => Order, (order) => order.staff)
  public orders: Order[];
}
