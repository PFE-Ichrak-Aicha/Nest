// admin.guard.ts
import { Injectable } from '@nestjs/common';
import { CanActivate, ExecutionContext, Inject } from '@nestjs/common';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { ExpertJwtStrategy } from './expert-jwt.strategy';
@Injectable()
export class ExpertGuard implements CanActivate {
  constructor(private jwtService: JwtService, private readonly expertJwtStrategy: ExpertJwtStrategy) { }

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>();
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return false;
    }

    const payload = await this.expertJwtStrategy.validate(token);
    if (!payload || !payload.isExpert) {
      return false;
    }

    req.user = payload;
    return true;
  }

}
