// admin.guard.ts
// admin.guard.ts
import { Injectable } from '@nestjs/common';
import { CanActivate, ExecutionContext, Inject } from '@nestjs/common';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest<Request>();
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return false;
    }
    const payload = this.jwtService.verify(token, { secret: 'SECRET_KEY' });
    if (!payload || !payload.email || !payload.isAdmin) {
      return false;
    }
    req.user = payload;
    return true;
  }
}
