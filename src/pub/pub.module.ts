import { Module } from '@nestjs/common';
import { PubService } from './pub.service';
import { PubController } from './pub.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { JwtModule } from '@nestjs/jwt';
import { UserJwtStrategy } from 'src/user/user-jwt.strategy';
import { AdminService } from 'src/admin/admin.service';
import { NotificationModule } from 'src/notification/notification.module';
import { ExpertService } from 'src/expert/expert.service';
import { ExpertModule } from 'src/expert/expert.module';
import { NotificationGateway } from 'src/notification/notification.gateway';
@Module({
  imports: [
    JwtModule.register({
      secret: 'SECRET_KEY', // replace with your own secret key
    }),NotificationModule,ExpertModule
  ],
  providers: [PubService ,PrismaService,UserService,UserJwtStrategy,AdminService,ExpertService,NotificationGateway],
  controllers: [PubController]
})
export class PubModule {}
