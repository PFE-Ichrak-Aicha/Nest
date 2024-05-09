import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { NotificationGateway } from './notification.gateway';
import { Socket } from 'socket.io'
import { join } from 'path';
import { NotFoundException } from '@nestjs/common';
@Injectable()
export class NotificationService {
    constructor(private prisma: PrismaService, private notificationGateway: NotificationGateway) { }


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
                cvLink: content.cvLink
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

    async getCVFromLink(cvLink: string): Promise<{ path: string }> {
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
    }
    }