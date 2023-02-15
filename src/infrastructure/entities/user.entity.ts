import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Despesa } from './despesa.entity';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Index({ unique: true })
  @Column('varchar', { unique: true })
  name: string;

  @Index({ unique: true })
  @Column('varchar', { unique: true })
  email: string;

  @Column('text')
  password: string;

  @Column('boolean', { default: false })
  isAdmin: boolean;

  @CreateDateColumn({ name: 'createdAt' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt', nullable: true })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deletedAt' })
  deletedAt: Date;

  @OneToMany(() => Despesa, (despesa) => despesa.user)
  despesas: Despesa[];
}
