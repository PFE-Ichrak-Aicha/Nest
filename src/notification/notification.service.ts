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
      const notification = {
        title: 'Nouvelle demande d\'expertise',
        body: `Une nouvelle demande d'expertise a été créée pour la publication ${content.pubId}.`,
        data: {
          userId: content.userId,
          //expertId : expertId,
          publicationId: content.pubId,
          expertId: content.expertId,
          /*firstName: content.firstName,
          lastName: content.lastName,
          email: content.email,
          telephone: content.telephone,
          city: content.city,
          description: content.description,
          cout: content.cout,
          cvLink: content.cvLink,*/
        },
      };

      const newNotification = await this.prisma.notification.create({
        data: {
          content: JSON.stringify(notification),
          isRead: false,
          expertId: content.expertId,
          userId: content.userId // ID de l'expert
        },
      });

      this.notificationGateway.sendNotificationToExpert(notification, client);
      return newNotification;
    } catch (error) {
      throw new Error(error);
    }
  }
  async createNotificationToUser(content: any, client: Socket) {
    try {
      const status = content.status === 'acceptée' ? 'acceptée' : 'refusée';
  
      const notification = {
        title: 'Notification pour l\'utilisateur${userId}',
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




/*async getCVFromLink(cvLink: string): Promise<{ path: string }> {
    try {
        // Extraire le nom du fichier CV à partir du lien
        const cvFileName = cvLink.split('/').pop();
 
        // Construire le chemin complet du fichier CV
        const cvFilePath = join(__dirname, '..', 'uploads', 'certif', cvFileName);
 
        return { path: cvFilePath };
    } catch (error) {
        console.error('Erreur lors de la récupération du CV :', error);
        throw new Error('Impossible de récupérer le CV.');
    }
}*/
