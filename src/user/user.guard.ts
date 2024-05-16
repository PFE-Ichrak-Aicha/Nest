
import { Injectable } from '@nestjs/common';
import { CanActivate, ExecutionContext, Inject } from '@nestjs/common';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { UserJwtStrategy } from './user-jwt.strategy';
@Injectable()
export class UserGuard implements CanActivate {
  constructor(private jwtService: JwtService, private readonly userJwtStrategy: UserJwtStrategy) { }

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>();
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return false;
    }

    const payload = await this.userJwtStrategy.validate(token);
    if (!payload) {
      return false;
    }

    req.user = payload;
    return true;
  }

}
