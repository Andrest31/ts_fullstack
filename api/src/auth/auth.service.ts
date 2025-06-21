/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { jwtConfig } from '../config/jwt.config';
import * as crypto from 'crypto';
import { User } from '../users/user.entity';


@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  private generateXAuthToken(userId: number): string {
    return crypto
      .createHash('sha256')
      .update(`${userId}${jwtConfig.salt}`)
      .digest('hex');
  }

  async generateTokens(user: User) {
    const payload = {
      sub: user.id,
      login: user.login,
      token: this.generateXAuthToken(user.id)
    };

    return {
      access_token: this.jwtService.sign(payload, {
        secret: jwtConfig.secret,
        expiresIn: jwtConfig.expiresIn
      }),
      x_auth_token: payload.token
    };
  }
}