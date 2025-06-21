/* eslint-disable prettier/prettier */
import { Entity, PrimaryColumn, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from '../users/user.entity'; // Импорт сущности User

@Entity('likes')
export class Like {
  @PrimaryColumn()
  cat_id: string;

  @ManyToOne(() => User, user => user.likes)
  user: User;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;
}

