/* eslint-disable prettier/prettier */
import { Entity, PrimaryColumn, ManyToOne, CreateDateColumn, JoinColumn } from 'typeorm';
import { User } from '../users/user.entity'; // Импорт сущности User

@Entity('likes')
export class Like {
  @PrimaryColumn()
  cat_id: string;

  @PrimaryColumn({ name: 'user_id' })
  user_id: number; // Теперь часть составного ключа

  @ManyToOne(() => User, user => user.likes)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @CreateDateColumn()
  created_at: Date;
}

