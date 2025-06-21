/* eslint-disable prettier/prettier */
import { Controller, Post, Body } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('user')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
  ) {}

  @Post()
  async create(
    @Body() userData: { login: string; password: string },
  ) {
    const user = await this.usersService.create(userData);
    
    return user;
  }
}