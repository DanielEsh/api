import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Order } from '../../order/entity/order.entity';

@Entity()
export class Staff {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ type: 'varchar' })
  public first_name: string;

  @Column({ type: 'varchar' })
  public last_name: string;

  @Column({ type: 'varchar', nullable: true })
  public middle_name: string;

  @Column({ type: 'bigint', nullable: true })
  public phone: number;

  @Column({ type: 'varchar', nullable: true })
  public email: string;

  @OneToMany(() => Order, (order) => order.staff)
  public orders: Order[];
}
