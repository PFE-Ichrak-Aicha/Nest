import { Module } from '@nestjs/common';
import { ExpertController } from './expert.controller';
import { ExpertService } from './expert.service';
import { NotificationGateway } from 'src/notification/notification.gateway';
import { PrismaService } from 'src/prisma/prisma.service';
import { NotificationController } from 'src/notification/notification.controller';
import { NotificationService } from 'src/notification/notification.service';
import { JwtModule } from '@nestjs/jwt';
import { ExpertJwtStrategy } from './expert-jwt.strategy';
import { NotificationModule } from 'src/notification/notification.module';
@Module({
  imports: [
    JwtModule.register({
      secret: 'SECRET_KEY', // replace with your own secret key
    }),NotificationModule
  ],
  controllers: [ExpertController,NotificationController],
  providers: [ExpertService,NotificationGateway, NotificationService,PrismaService,ExpertJwtStrategy],

})
export class ExpertModule {}
