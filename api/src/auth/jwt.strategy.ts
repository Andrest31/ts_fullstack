/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { jwtConfig } from '../config/jwt.config';
import * as crypto from 'crypto';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConfig.secret,
    });
  }

  async validate(payload: any) {
    const expectedToken = crypto
      .createHash('sha256')
      .update(`${payload.sub}${jwtConfig.salt}`)
      .digest('hex');

    if (payload.token !== expectedToken) {
      throw new Error('Token validation failed');
    }

    return { 
      id: payload.sub, 
      login: payload.login 
    };
  }
}