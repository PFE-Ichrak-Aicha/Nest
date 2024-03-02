import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import{JwtModule, JwtService} from "@nestjs/jwt";
import { JwtStrategy } from './strategy.service';
import { UserService } from 'src/user/user.service';
@Module({
  imports: [JwtModule.register({})],
  controllers: [AuthController],
  providers: [AuthService, JwtService, JwtStrategy, UserService]
})
export class AuthModule {}
