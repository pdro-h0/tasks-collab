import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Comment } from './comment.entity';
import { TaskHistory as TaskHistoryEntity } from './task-history.entity';

export const TASK_STATUS = {
  TODO: 'TODO',
  IN_PROGRESS: 'IN_PROGRESS',
  REVIEW: 'REVIEW',
  DONE: 'DONE',
} as const;

export const TASK_PRIORITY = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
  URGENT: 'URGENT',
} as const;

@Entity('tasks')
export class Task {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: Object.values(TASK_STATUS),
    default: TASK_STATUS.TODO,
  })
  status: keyof typeof TASK_STATUS;

  @Column({
    type: 'enum',
    enum: Object.values(TASK_PRIORITY),
    default: TASK_PRIORITY.MEDIUM,
  })
  priority: keyof typeof TASK_PRIORITY;

  @Column({
    type: 'timestamp with time zone',
    name: 'due_date',
  })
  dueDate: Date;

  @Column({
    type: 'uuid',
    array: true,
    default: '{}',
    name: 'assigned_user_ids',
  })
  assignedUserIds: string[];

  @OneToMany(() => Comment, (comment) => comment.id, { cascade: true })
  comments: Comment[];

  @OneToMany(() => TaskHistoryEntity, (history) => history.id, {
    cascade: true,
  })
  history: TaskHistoryEntity[];

  @Column({ type: 'uuid', name: 'author_id' })
  authorId: string;

  @CreateDateColumn({ type: 'timestamp with time zone', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone', name: 'updated_at' })
  updatedAt: Date;
}
