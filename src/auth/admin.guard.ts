// admin.guard.ts
// admin.guard.ts
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AdminService } from 'src/admin/admin.service';


@Injectable()
export class AdminGuard extends AuthGuard('jwt') {
  constructor(private adminService: AdminService) {
    super();
  }

  handleRequest(err, user, info, context) {
    if (err ||!user) {
      return false;
    }

    const isAdmin = this.adminService.isAdmin(user);

    if (!isAdmin) {
      return false;
    }

    return user;
  }
}