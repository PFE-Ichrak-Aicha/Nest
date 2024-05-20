import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule, JwtService } from "@nestjs/jwt";
import { JwtStrategy } from './strategy.service';
import { UserService } from 'src/user/user.service';
import { NotificationModule } from 'src/notification/notification.module';
import { NotificationController } from 'src/notification/notification.controller';
import { NotificationGateway } from 'src/notification/notification.gateway';
import { NotificationService } from 'src/notification/notification.service';
@Module({
  imports: [JwtModule.register({}),NotificationModule],
  controllers: [AuthController,NotificationController],
  providers: [AuthService, JwtService, JwtStrategy, UserService,NotificationGateway, NotificationService]
})
export class AuthModule { }
