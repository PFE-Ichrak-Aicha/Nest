import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Admin, Expert, Publication, Subscription, User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { MailerService } from 'src/mailer/mailer.service';
import { CreateSubscriptionDto } from 'dto/createSubscriptionDto';
import { UpdateSubscriptionDto } from 'dto/updateSubscriptionDto';
import { UpdateAccountDto } from 'dto/updateAccountDto';
//import { PublicationWhereInput } from '@prisma/client';
//import { UserCreateNestedOneWithoutSubscriptionsInput } from '@generated/type-graphql';
import * as bcrypt from 'bcrypt';
import { Notification } from '@prisma/client';
import { ExpertRequest } from '@prisma/client';
import { join } from 'path';
interface SearchPublicationsOptions {
  query?: string;
  marque?: string;
  model?: string;
  couleur?: string;
  anneeFabrication?: number;
  nombrePlace?: number;
  prix?: number;
  typeCarburant?: TypeCarburant;
}
enum TypeCarburant {
  ESSENCE = 'Essence',
  DIESEL = 'Diesel',
  GPL = "GPL",
  Electrique = 'Electrique'
  // Autres types de carburant...
}

@Injectable()
export class AdminService {
  constructor(private readonly prismaService: PrismaService,private readonly mailerService: MailerService,private prisma: PrismaService) { }

 /* async isAdmin(user: any): Promise<boolean> {
    const admin = await this.prismaService.admin.findUnique({ where: { email: user.email } });
    return admin !== undefined;
  }*/
  async getUsers(): Promise<Partial<User>[]> {
    const users = await this.prismaService.user.findMany({
      select: {
        Nom: true,
        Prenom: true,
        email: true,
        Adresse: true,
        Ville: true,
        CodePostal: true,
        PhotoProfil: true,
      },
    });
    return users;
  }


  async getAllPublications(): Promise<Partial<Publication>[]> {
    const publications = await this.prismaService.publication.findMany({
      select: {
        pubid: true,
        marque: true,
        model: true,
        anneeFabrication: true,
        nombrePlace: true,
        couleur: true,
        kilometrage: true,
        prix: true,
        descrption: true,
        typeCarburant: true,
        userId: true,
      },
    });
    return publications;
  }


  async searchUsers(key: string) {
    const keyword = key
      ? {
        OR: [
          { Nom: { contains: key } },
          { Prenom: { contains: key } },
          { email: { contains: key } },
          { Ville: { contains: key } },
          { CodePostal: { contains: key } },
          { Adresse: { contains: key } },
          { NumTel: { contains: key } },
        ],
      }
      : {};

    return this.prismaService.user.findMany({
      where: keyword,
      select: {
        Nom: true,
        Prenom: true,
        NumTel: true,
        Adresse: true,
        email: true,
        Ville: true,
        CodePostal: true,
      },
    });
  }


  async searchPublications(
    query: string,
    marque?: string,
    model?: string,
    couleur?: string,
    anneeFabrication?: number,
    nombrePlace?: number,
    prix?: number,
    typeCarburant?: TypeCarburant,
  ): Promise<Publication[]> {
    const publications = await this.prismaService.publication.findMany({
      where: {
        OR: [
          { marque: { contains: query, } },
          { model: { contains: query, } },
          { couleur: { contains: query, } },
          { anneeFabrication: { equals: anneeFabrication } },
          { nombrePlace: { equals: nombrePlace } },
          { prix: { equals: prix } },
          { typeCarburant: { equals: typeCarburant } },
        ],
      },
    });
    return publications;
  }


  async getPubById(pubId: number): Promise<Publication> {
    const publication = await this.prismaService.publication.findUnique({
      where: { pubid: pubId },
    });
    if (!publication) throw new NotFoundException("Publication not found");
    return publication;
  }



  async getUserById(userId: number): Promise<{ Nom: string, Prenom: string, email: string, NumTel: string, Ville: string, Adresse: string, PhotoProfil: string }> {
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
      select: {
        Nom: true,
        Prenom: true,
        email: true,
        NumTel: true,
        Ville: true,
        Adresse: true,
        PhotoProfil: true
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }




  /* async getAdminDashboard(): Promise<User[]> {
     return this.prismaService.user.findMany({
       where: {
         isAdmin: true,
       },
     });
   }*/

  async getTotalUsers(): Promise<number> {
    const totalUsers = await this.prismaService.user.count();
    return totalUsers;
  }

  async getTotalPublications(): Promise<number> {
    const totalPublications = await this.prismaService.publication.count();
    return totalPublications;
  }

  async createSubscription(createSubscriptionDto: CreateSubscriptionDto) {
    const { name, duration, price, description } = createSubscriptionDto;

    await this.prismaService.subscription.create({
      data: {
        name,
        duration,
        price,
        description,

      },
    });
    return { data: "Abonnement crée" }
  }

  async getAllSubscriptions(): Promise<Partial<Subscription>[]> {
    const Subscriptions = await this.prismaService.subscription.findMany({
      select: {
        ids: true,
        name: true,
        price: true,
        duration: true,
        description: true,
      }
    });
    return Subscriptions;
  }

  async getSubscriptionById(id: number) {
    return this.prismaService.subscription.findUnique({
      where: { ids: id },
    });
  }


  async updateSub(ids: number, updateSubscriptionDto: UpdateSubscriptionDto) {
    const subscription = await this.prismaService.subscription.findUnique({ where: { ids } });
    if (!subscription) throw new NotFoundException("subscription not found")
    await this.prismaService.subscription.update({ where: { ids }, data: { ...updateSubscriptionDto } })
    return { data: "Abonnement modifié" }
  }

  async deleteSubscription(id: number) {
    await this.prismaService.subscription.delete({
      where: { ids: id },
    })
    return { data: "Subscription deleted" };
  }

  /*async deleteSub(ids : number , userId: number){
    const subscription = await this.prismaService.subscription.findUnique({where:{ids}});
    if (!subscription) throw new NotFoundException("subscription not found")
    if (subscription.userId != userId) throw new ForbiddenException("Forbidden action")
    await this.prismaService.subscription.delete({ where: { ids } })
  52953081
  }*/
  async updateAdmin(adminId: number, updateAccountDto: UpdateAccountDto) {
    // Récupérer l'administrateur à partir de son ID
    const admin = await this.prismaService.admin.findUnique({ where: { ida: adminId } });
    if (!admin) {
        throw new NotFoundException('Admin not found');
    }

    // Mettre à jour les informations de l'administrateur
    let updateAccount: Admin;
    if (updateAccountDto.MotDePasse) {
        const hash = await bcrypt.hash(updateAccountDto.MotDePasse, 10);
        updateAccount = await this.prismaService.admin.update({
            where: { ida: adminId },
            data: { ...updateAccountDto, MotDePasse: hash },
        });
    } else {
        updateAccount = await this.prismaService.admin.update({
            where: { ida: adminId },
            data: { ...updateAccountDto },
        });
    }

    // Retourner un message de succès après la mise à jour
    return { message: 'Vos informations ont été mises à jour avec succès.' };
}


  async getUserId(userId: number): Promise<Admin> {
    return this.prismaService.admin.findUnique({
      where: { ida: userId },
    });
  }

  isAdminn(user: any): boolean {
    return user.isAdmin;
  }


  async getAdminNotifications(adminId: number): Promise<Notification[]> {
    return this.prismaService.notification.findMany({
      where: {
        adminId,
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }
  
  async getNotificationByIdAndMarkAsRead(idn: any): Promise<Notification> {
    try {
      let id = parseInt(idn,10)
        const notification = await this.prismaService.notification.findUnique({
            where: { idn: id }
        });

        if (!notification) {
            throw new Error(`Notification with ID ${id} not found.`);
        }

        // Marquer la notification comme lue
        await this.prismaService.notification.update({
            where: { idn: id },
            data: { isRead: true }
        });

        return notification;
    } catch (error) {
        console.error('Error getting and marking notification as read:', error);
        throw new Error('Failed to get and mark notification as read.');
    }
}async getCVFromNotification(notificationId: number): Promise<{ path: string }> {
  const notification = await this.prisma.notification.findUnique({
      where: { idn: notificationId },
  });

  if (!notification || !notification.content) {
      throw new NotFoundException('Notification not found or missing content');
  }

  const content = JSON.parse(notification.content);
  const cvLink = content.cvLink;

  // Construire le chemin complet du fichier CV
  const cvFilePath = join(__dirname, '..', 'uploads', 'certif', cvLink);
  if (!cvFilePath) {
    throw new NotFoundException('CV not found');
}

return { path: cvFilePath };
}

  async confirmRequest(expertReqId: any): Promise<boolean> {
    try {

      let id = parseInt(expertReqId, 10);
      const currentRequest = await this.prisma.expertRequest.findUnique({

        where: { ider: id }

      });
      if (!currentRequest) {
        throw new Error(`Request with ID ${expertReqId} not found.`);
      }

      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(currentRequest.email, saltRounds);
      const newExpert = await this.prisma.expert.create({
        data: {
          firstName: currentRequest.firstName,
          lastName: currentRequest.lastName,
          email: currentRequest.email,
          cv: currentRequest.cv,
          city: currentRequest.city,
          passe: hashedPassword, // Le mot de passe sera l'email de la demande d'expertise
          tel: currentRequest.telephone, // Le numéro de téléphone sera celui de la demande d'expertise
          description: currentRequest.description,
          cout: currentRequest.cout

        },
      });
      await this.prisma.expertRequest.update({
        where: { ider: id },
        data: { status: 'approuvé' },
      });
      await this.mailerService.sendExpertAcceptanceEmail(currentRequest.email, currentRequest.email);

      return true;
    } catch (error) {
      console.error('Error confirming order:', error);
      return false;
    }
  }

  async refuseRequest(expertReqId: any): Promise<boolean> {
    try {

      let id = parseInt(expertReqId, 10);
      const currentRequest = await this.prisma.expertRequest.findUnique({

        where: { ider: id }

      });
      if (!currentRequest) {
        throw new Error(`Request with ID ${expertReqId} not found.`);
      }

      await this.prisma.expertRequest.update({
        where: { ider: id },
        data: { status: 'refusé' },
      });
      await this.mailerService.sendExpertRefusalEmail(currentRequest.email);
      return true;
    } catch (error) {
      console.error('Error confirming order:', error);
      return false;
    }
  }

  async getAllExperts(): Promise<Expert[]> {
    return this.prismaService.expert.findMany();
}
async getExpertById(ide: any): Promise<Expert> {
  
  let id = parseInt(ide, 10);
  return this.prismaService.expert.findUnique({
      where: { ide: id }
  });
}

async getAllExpertRequests(): Promise<ExpertRequest[]> {
  return this.prismaService.expertRequest.findMany();
}

async getExpertRequestById(ider:any): Promise <ExpertRequest>{
  let id = parseInt(ider, 10);
  return this.prismaService.expertRequest.findUnique({
   where: {ider: id}
  })
}




}
