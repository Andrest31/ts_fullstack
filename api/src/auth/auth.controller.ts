/* eslint-disable prettier/prettier */
import { Controller, Post, Body, Res, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { LoginUserDto } from './dto/login-user.dto';

@Controller('auth')
@ApiTags('users') // Группировка в Swagger
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Аутентификация пользователя' })
  @ApiBody({ type: LoginUserDto })
  @ApiResponse({ 
    status: HttpStatus.OK,
    description: 'Успешная аутентификация',
    headers: {
      'X-Auth-Token': {
        description: 'Токен аутентификации (SHA256)',
        schema: { type: 'string' }
      }
    }
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Неверные учетные данные'
  })
  async login(
    @Body() loginData: { login: string; password: string },
    @Res({ passthrough: true }) res: Response
  ) {
    const user = await this.authService.validateUser(loginData.login, loginData.password);
    
    if (!user) {
      res.status(HttpStatus.UNAUTHORIZED);
      return { message: 'Неверные учетные данные' };
    }

    const token = await this.authService.generateHashToken(user.id);
    res.setHeader('X-Auth-Token', token);
    
    return {
      id: user.id,
      login: user.login,
      createdAt: user.createdAt
    };
  }
}