import { Module } from '@nestjs/common';
import { ExpertController } from './expert.controller';
import { ExpertService } from './expert.service';
import { NotificationGateway } from 'src/notification/notification.gateway';
import { PrismaService } from 'src/prisma/prisma.service';
import { NotificationController } from 'src/notification/notification.controller';
import { NotificationService } from 'src/notification/notification.service';
@Module({
  controllers: [ExpertController,NotificationController],
  providers: [ExpertService,NotificationGateway, NotificationService,PrismaService],

})
export class ExpertModule {}
