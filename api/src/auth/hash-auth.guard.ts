/* eslint-disable prettier/prettier */
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import * as crypto from 'crypto';

@Injectable()
export class HashAuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    
    if (!token) {
      throw new UnauthorizedException();
    }

    const [userId, hash] = token.split('|');
    const isValid = await this.validateToken(userId, hash);

    if (!isValid) {
      throw new UnauthorizedException();
    }

    request.user = { userId };
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    return request.headers['x-auth-token'] as string;
  }

  private async validateToken(userId: string, hash: string): Promise<boolean> {
    const expectedHash = crypto
      .createHash('sha256')
      .update(`${userId}${process.env.SECRET_SALT}`)
      .digest('hex');
      
    return hash === expectedHash;
  }
}