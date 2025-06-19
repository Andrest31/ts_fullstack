/* eslint-disable prettier/prettier */
import { Entity, PrimaryColumn, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from './user.entity'; // Импорт сущности User

@Entity()
export class Like {
  @PrimaryColumn()
  cat_id: string; // ID из TheCatAPI

  @ManyToOne(() => User)
  user: User;

  @CreateDateColumn()
  created_at: Date;
}
