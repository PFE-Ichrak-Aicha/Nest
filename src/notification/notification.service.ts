import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { NotificationGateway } from './notification.gateway';
import { Notification } from '@prisma/client';
import { Socket } from 'socket.io'
import { CreationCompteRequest, User } from '@prisma/client';
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
          Prenom: true,
          id : true
        }
      });
      const expert = await this.prisma.expert.findUnique({
        where: {
          ide: content.expertId
        },
        select: {
          email: true
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
          userId:null
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
         userId: content.userId,
         expertId: content.expertId,
          status: status,
        },
      };
      const newNotification = await this.prisma.notification.create({
        data: {
          content: JSON.stringify(notification),
          isRead: false,
          userId: content.userId,
          expertId: null
        },
      });
      this.notificationGateway.sendNotificationToUser(notification, client);
      return newNotification;
    } catch (error) {
      throw new Error(error);
    }
  }
  async notifierAdminDemandeCreationCompte(content: any, client: Socket) {
    try {
      const notification = {
        title: 'Nouvelle demande de création de compte',
        body: `Une nouvelle demande de création de compte a été créée par ${content.nom} ${content.prenom}.`,
        data: {
          //requestId:content.id,
          nom : content.nom,
          prenom : content.prenom,
          email : content.email,
          //adresse : content.email,
          //ville: content.ville,
          //codePostal: content.codePostal,
          commentaire :content.commentaire

        },
      };
  
      const newNotification = await this.prisma.notification.create({
        data: {
          content: JSON.stringify(notification),
          isRead: false,
          adminId: 1, // ID de l'administrateur
        },
      });
  
      this.notificationGateway.notifierAdmin(notification, client);
    return newNotification
    } catch (error) {
      throw new Error(error);
    }
  }
  async getNotificationById(id: number): Promise<Notification | null> {
    try {
      return await this.prisma.notification.findUnique({
        where: {
          idn : id,
        },
      });
    } catch (error) {
      console.error('Error fetching notification:', error);
      throw new Error('Error fetching notification');
    }
  }
}



