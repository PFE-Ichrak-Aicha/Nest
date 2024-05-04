import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Notification } from '@prisma/client';
import { NotificationDTO } from 'dto/notificationDto';
import { NotificationGateway } from './notification.gateway';
import { Socket} from 'socket.io'
@Injectable()
export class NotificationService {
    constructor(private prisma: PrismaService, private notificationGateway: NotificationGateway) {}


   /* async createNotification(notificationDto: NotificationDTO):Promise<Notification>{
        const { content, isRead } = notificationDto;
        const notification = await this.prisma.notification.create({
            data:{
                content,
                isRead : false
            }
        })
        this.notificationGateway.emitNotification(notification);
        return notification;
    }*/
    createNotificationToAdmin(content: string, client: Socket) {
        this.notificationGateway.sendNotificationToAdmin(content,client);
      }
}
