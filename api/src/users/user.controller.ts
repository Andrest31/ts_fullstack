/* eslint-disable prettier/prettier */
import { Controller, Post, Body, Res } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { UsersService } from './users.service';

@Controller('user')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @Post()
  async create(@Body() userData: { login: string; password: string }, @Res() res) {
    const user = await this.usersService.create(userData);
    const tokens = await this.authService.generateTokens(user);
    
    return res
      .header('X-Auth-Token', tokens.x_auth_token)
      .header('Authorization', `Bearer ${tokens.access_token}`)
      .json({
        id: user.id,
        login: user.login,
        // Никогда не возвращаем пароль!
      });
  }
}