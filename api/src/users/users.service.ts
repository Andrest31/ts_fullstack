/* eslint-disable prettier/prettier */
import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findByLogin(login: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { login } });
  }

  async validateUser(login: string, password: string): Promise<User | null> {
  const user = await this.findByLogin(login);
  if (user && user.password === password) { // В реальном приложении используйте хеширование!
    return user;
  }
  return null;
}

  async create(userData: { login: string; password: string }): Promise<User> {
    const existingUser = await this.findByLogin(userData.login);
    if (existingUser) {
      throw new ConflictException('Пользователь с таким логином уже существует');
    }
    
    const user = this.usersRepository.create(userData);
    return this.usersRepository.save(user);
  }
}