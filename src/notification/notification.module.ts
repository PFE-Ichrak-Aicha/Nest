import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { NotificationGateway } from './notification.gateway';


@Module({
  providers: [NotificationService,PrismaService,NotificationGateway],
  controllers: [NotificationController],
  exports:[NotificationService],

})
export class NotificationModule {}
