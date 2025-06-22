/* eslint-disable prettier/prettier */
// users.controller.ts
import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { UsersService } from './users.service';

@Controller('user')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @Post('')
  async register(@Body() userData: { login: string; password: string }) {
    try {
      const user = await this.usersService.create(userData);
      const tokens = await this.authService.generateTokens(user);
      
      return {
        user: {
          id: user.id,
          login: user.login
        },
        access_token: tokens.access_token,
        x_auth_token: tokens.x_auth_token
      };
    } catch (error) {
      if (error.message === 'Пользователь с таким логином уже существует') {
        throw new HttpException(
          { message: error.message },
          HttpStatus.CONFLICT
        );
      }
      throw new HttpException(
        { message: 'Ошибка регистрации' },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

}