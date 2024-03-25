// admin.guard.ts
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/*@Injectable()
export class AdminGuard extends AuthGuard('jwt') implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // Vérifiez si l'utilisateur est un administrateur
    if (user && user.isAdmin) {
      return true; // L'utilisateur est un administrateur
    }

    return false; // L'utilisateur n'est pas un administrateur
  }
}*/
@Injectable()
export class AdminGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest(err, user, info) {
    if (err || !user || !user.isAdmin) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
