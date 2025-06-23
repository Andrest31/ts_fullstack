/* eslint-disable prettier/prettier */
import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  private readonly SALT_ROUNDS = 10;

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findByLogin(login: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { login } });
  }

  async validateUser(login: string, password: string): Promise<User | null> {
    const user = await this.findByLogin(login);
    if (user && await bcrypt.compare(password, user.password)) {
      return user;
    }
    return null;
  }

  async create(userData: { login: string; password: string }): Promise<User> {
    const existingUser = await this.findByLogin(userData.login);
    if (existingUser) {
      throw new ConflictException('Пользователь с таким логином уже существует');
    }
    
    // Хешируем пароль перед сохранением
    const hashedPassword = await bcrypt.hash(userData.password, this.SALT_ROUNDS);
    
    const user = this.usersRepository.create({
      login: userData.login,
      password: hashedPassword
    });
    
    return this.usersRepository.save(user);
  }
}