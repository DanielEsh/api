import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Role } from '../../auth/roles.enum';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column({ type: 'varchar' })
  public email!: string;

  @Column({ type: 'varchar' })
  public password!: string;

  @Column({ type: 'varchar', nullable: true })
  public name: string | null;

  @Column({ type: 'timestamp', nullable: true, default: null })
  public lastLoginAt: Date | null;

  @Column({
    type: 'enum',
    enum: Role,
    array: true,
    default: [Role.GUEST],
  })
  public roles: Role[];

  @Column('boolean', { default: false })
  public isSuperUser: boolean;

  @Column({ type: 'varchar', nullable: true })
  public hashedRefreshToken: string | null;
}
