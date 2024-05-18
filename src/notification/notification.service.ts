import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { NotificationGateway } from './notification.gateway';
import { Socket } from 'socket.io'
import { User } from '@prisma/client';
@Injectable()
export class NotificationService {
  constructor(private prisma: PrismaService, private notificationGateway: NotificationGateway) { }


  async createNotificationToAdmin(content: any, client: Socket) {
    try {
      const notification = {
        title: 'Nouvelle demande d\'expertise',
        body: `Une nouvelle demande d'expertise a été créée par ${content.firstName} ${content.lastName}.`,
        data: {
          firstName: content.firstName,
          lastName: content.lastName,
          email: content.email,
          telephone: content.telephone,
          city: content.city,
          description: content.description,
          cout: content.cout,
          cvLink: content.cvLink,
          //notificationContent,
        }
      };
      // try {
      // console.log("in notification service", content)
      const newNotification = await this.prisma.notification.create({
        data: {
          content: JSON.stringify(notification),
          isRead: false,
          adminId: 1, // ID de l'administrateur
        },
      });

      this.notificationGateway.sendNotificationToAdmin(notification, client);
      return newNotification
    } catch (error) {
      throw new Error(error)
    }
  }
  async createNotificationToExpert(content: any, client: Socket) {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          id: content.userId
        },
        select: {
          Nom: true,
          Prenom: true
        }
      });
  
      const notification = {
        title: 'Nouvelle demande d\'expertise',
        body: `${user.Nom} ${user.Prenom} a envoyé une nouvelle demande d'expertise pour la publication ${content.pubId}.`,
        data: {
          userId: content.userId,
          publicationId: content.pubId,
          expertId: content.expertId
        }
      };
  
      const newNotification = await this.prisma.notification.create({
        data: {
          content: JSON.stringify(notification),
          isRead: false,
          expertId: content.expertId,
          userId: content.userId
        }
      });
  
      this.notificationGateway.sendNotificationToExpert(notification, client);
      return newNotification;
    } catch (error) {
      throw new Error(error);
    }
  }
  async createNotificationToUser(content: any, client: Socket) {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          id: content.userId
        },
        select: {
          Nom: true,
          Prenom: true
        }
      });
      const status = content.status === 'acceptée' ? 'acceptée' : 'refusée';
  
      const notification = {
        title: 'Notification pour l\'utilisateur${user.Nom} ${user.Prenom} ',
        body: `Votre demande d'expertise a été ${status}.`,
        data: {
         // userId: content.userId,
          status: status,
        },
      };
  
      const newNotification = await this.prisma.notification.create({
        data: {
          content: JSON.stringify(notification),
          isRead: false,
          userId: content.userId,
        },
      });
  
      this.notificationGateway.sendNotificationToUser(notification, client);
      return newNotification;
    } catch (error) {
      throw new Error(error);
    }
  }

}



