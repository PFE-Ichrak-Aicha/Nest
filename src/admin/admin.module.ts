import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';

import { PrismaService } from 'src/prisma/prisma.service';
import { JwtModule, JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.register({
      secret: 'SECRET_KEY', // replace with your own secret key
    }),
  ],
  providers: [AdminService, PrismaService,JwtService],
  controllers: [AdminController],
  exports: [],
})
export class AdminModule { }
