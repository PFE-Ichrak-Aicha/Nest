import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserJwtStrategy } from './user-jwt.strategy';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { NotificationModule } from 'src/notification/notification.module';
import { NotificationController } from 'src/notification/notification.controller';
import { NotificationGateway } from 'src/notification/notification.gateway';
@Module({
  imports: [
    JwtModule.register({
      secret: 'SECRET_KEY', // replace with your own secret key
    }),NotificationModule
  ],
  
  providers: [UserService, PrismaService, UserJwtStrategy,NotificationGateway],
  controllers: [UserController,NotificationController]
})
export class UserModule { }
