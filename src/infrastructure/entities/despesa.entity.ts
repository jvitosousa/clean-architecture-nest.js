import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Generated,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity({ name: 'despesas' })
export class Despesa {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('decimal', { precision: 10, scale: 2 })
  valor: number;

  @CreateDateColumn({ name: 'data' })
  data: Date;

  @Index({ unique: true })
  @Column('text')
  descricao: string;

  @ManyToOne(() => User, (user) => user.despesas)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Generated('uuid')
  uuId: number;

  @CreateDateColumn({ name: 'createdAt' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deletedAt' })
  deletedAt: Date;
}
