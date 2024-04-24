import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserJwtStrategy } from './user-jwt.strategy';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
@Module({
  imports: [
    JwtModule.register({
      secret: 'SECRET_KEY', // replace with your own secret key
    }),
  ],
  providers: [UserService, PrismaService, UserJwtStrategy],
  controllers: [UserController]
})
export class UserModule { }
