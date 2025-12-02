import { Entity, PrimaryColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('task_histories')
export class TaskHistory {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'user_id' })
  userId: string;

  @Column({ type: 'varchar' })
  action: string;

  @CreateDateColumn({ type: 'timestamp with time zone', name: 'timestamp' })
  timestamp: Date;

  @Column({ type: 'jsonb' })
  changes: Record<string, { oldValue: any; newValue: any }>;
}
