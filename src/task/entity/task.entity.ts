import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../auth/entity/user.entity';

export enum Status {
  POSTED = 'POSTED',
  DRAFT = 'DRAFT',
  DELETED = 'DELETED',
}

@Entity()
export class Task {
  @PrimaryGeneratedColumn('uuid', { name: 'task_id' })
  taskId: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  status: Status;

  @ManyToOne(() => User, (e) => e.task)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
