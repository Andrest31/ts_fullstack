/* eslint-disable prettier/prettier */
import { Controller, Post, Body, Res } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { UsersService } from './users.service';
import { Response } from 'express';

@Controller('user')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @Post()
  async create(
    @Body() userData: { login: string; password: string },
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = await this.usersService.create(userData);
    const token = await this.authService.generateHashToken(user.id);
    
    res.setHeader('X-Auth-Token', token);
    return user;
  }
}