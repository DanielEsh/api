import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
}
