// admin.guard.ts
// admin.guard.ts
import { Injectable } from '@nestjs/common';
import { CanActivate, ExecutionContext, Inject } from '@nestjs/common';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { AdminJwtStrategy } from './admin-jwt.strategy';
@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private jwtService: JwtService,private readonly adminJwtStrategy: AdminJwtStrategy) {}

  async canActivate(
    context: ExecutionContext,
  ):  Promise<boolean>  {
    const req = context.switchToHttp().getRequest<Request>();
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return false;
    }
    /*const payload = await this.adminJwtStrategy.validate(token);
    if (!payload || !payload.isAdmin.email || !payload.isAdmin) {
      return false;
    }
    req.user = payload;
    return true;
  }*/
  const payload = await this.adminJwtStrategy.validate(token);
  if (!payload || !payload.isAdmin) {
    return false;
  }
  /*if (!payload.isAdmin.email) {
    return false;
  }*/
  req.user = payload;
  return true;
}

}
