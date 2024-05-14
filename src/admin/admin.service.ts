import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Admin, BoiteVitesse, City, Expert, Publication, Sellerie, Subscription, User } from '@prisma/client';
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
import { PubService } from 'src/pub/pub.service';
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
  constructor(private readonly prismaService: PrismaService, private readonly mailerService: MailerService, private prisma: PrismaService, private readonly pubService: PubService) { }

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
    anneeMin?: number,
    anneeMax?: number,
    nombrePlace?: number,
    prixMin?: number,
    prixMax?: number,
    city?: City,
    boiteVitesse?: BoiteVitesse,
    typeCarburant?: string,
    sellerie?: Sellerie,
    equippement?: string,
  ): Promise<Publication[]> {
    const where: any = {
      OR: []
    };

    if (marque) {
      where.OR.push({ marque: { contains: marque } });
    }
    if (model) {
      where.OR.push({ model: { contains: model } });
    }
    if (couleur) {
      where.OR.push({ couleur: { contains: couleur } });
    }
    if (!isNaN(anneeMin) && !isNaN(anneeMax)) {
      where.OR.push({ anneeFabrication: { gte: anneeMin, lte: anneeMax } });
    }
    if (!isNaN(nombrePlace)) {
      where.OR.push({ nombrePlace: { equals: nombrePlace } });
    }
    if (!isNaN(prixMin) && !isNaN(prixMax)) {
      where.OR.push({ prix: { gte: prixMin, lte: prixMax } });
    }
    if (city) {
      where.OR.push({ city: { equals: city } });
    }
    if (boiteVitesse) {
      where.OR.push({ boiteVitesse: { equals: boiteVitesse } });
    }
    if (typeCarburant) {
      where.OR.push({ typeCarburant: { equals: typeCarburant } });
    }
    if (sellerie) {
      where.OR.push({ sellerie: { equals: sellerie } });
    }
    if (equippement) {
      where.equippements = { some: { name: { equals: equippement } } };
    }
   // const publications = await this.prismaService.publication.findMany({
     // where
   // });
   const publications = await this.prismaService.publication.findMany({
    where,
    include: {
      user: {
        select: {
          Nom: true,
          Prenom: true,
          email: true,
          NumTel: true,
          Ville: true,
          Adresse: true
        }
      },
      equippementPublications: {
        include: {
          equippement: {
            select: {
              name: true
            }
          }
        }
      }
    }
  });
   // const publications = await this.pubService.getAll();
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
  async getTotalExperts(): Promise<number> {
    const totalExperts = await this.prismaService.expert.count();
    return totalExperts;
  }
  async totalExpertsRequests(): Promise<number> {
    const totalExpertsRequests = await this.prismaService.expertRequest.count();
    return totalExpertsRequests;
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
      let id = parseInt(idn, 10)
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
  } async getCVFromNotification(notificationId: number): Promise<{ path: string }> {
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

  async getExpertRequestById(ider: any): Promise<ExpertRequest> {
    let id = parseInt(ider, 10);
    return this.prismaService.expertRequest.findUnique({
      where: { ider: id }
    })
  }

  async updateAccount(payload: any, updateAccountDto: UpdateAccountDto) {

    const adminId = payload;
    const admin = await this.prismaService.admin.findUnique({ where: { ida: adminId } });
    if (!admin) throw new NotFoundException('User not found');

    let updateAccount:
      Admin;
    if (updateAccountDto.MotDePasse) {
      const hash = await bcrypt.hash(updateAccountDto.MotDePasse, 10);
      updateAccount = await this.prismaService.admin.update({
        where: { ida: adminId },
        data: { ...updateAccountDto, MotDePasse: hash },
      });
    } else {
      // Si le mot de passe n'est pas fourni, mettez à jour les autres champs sans toucher au mot de passe
      updateAccount = await this.prismaService.admin.update({
        where: { ida: adminId },
        data: { ...updateAccountDto },
      });
    }
    return { message: 'Vos informations ont été mises à jour avec succès.' };
  }
  async getAdminById(payload: any): Promise<Admin> {
    const adminId = payload;
    const admin = await this.prismaService.admin.findUnique({
      where: { ida: adminId },
    });
    if (!admin) {
      throw new NotFoundException('User not found');
    }
    const { MotDePasse, ...userWithoutPassword } = admin;
    return admin;
  }
  async associateProfileImage(adminId: number, profileImage: string): Promise<void> {
    const existingAdmin = await this.prismaService.admin.findUnique({ where: { ida: adminId } });
    if (!existingAdmin) {
      throw new NotFoundException('Utilisateur non trouvé');
    }
    await this.prismaService.admin.update({
      where: { ida: adminId },
      data: { PhotoProfil: profileImage },
    });
  }
  async getProfileImageName(adminId: number) {
    // Recherchez l'utilisateur dans la base de données en fonction de son ID
    try {
      // Recherchez l'utilisateur dans la base de données en fonction de son ID
      const admin = this.prismaService.admin.findUnique({
        where: { ida: adminId },
        select: { PhotoProfil: true } // Sélectionnez uniquement le champ PhotoProfil
      });

      if (!admin || !(await admin).PhotoProfil) {
        throw new NotFoundException('Image de profil non trouvée pour cet utilisateur');
      }

      // Retournez le nom de l'image de profil
      return (await admin).PhotoProfil;
    } catch (error) {
      throw error;
    }
  }
  async updateProfileImage(payload: any, filename: string): Promise<Object> {
    // Recherche de l'utilisateur dans la base de données
    const adminId = typeof payload === 'number' ? payload : parseInt(payload);
    const admin = await this.prismaService.admin.findUnique({ where: { ida: adminId } });
    if (!admin) {
      // Gérer le cas où l'utilisateur n'est pas trouvé
      throw new NotFoundException('User not found');
    }
    try {
      // Mettre à jour la colonne PhotoProfil de l'utilisateur avec le nom du fichier
      const updatedUser = await this.prismaService.admin.update({
        where: { ida: adminId },
        data: { PhotoProfil: filename },
      });

      return { message: 'Profile image updated successfully' };
    } catch (error) {
      // Gérer les erreurs potentielles
      throw new Error('Failed to update profile image');
    }
  }

  async searchExperts(key: string) {
    const keyword = key
      ? {
        OR: [
          { firstName: { contains: key } },
          { lastName: { contains: key } },
          { email: { contains: key } },
          // { Ville: { contains: key } },
          //{ CodePostal: { contains: key } },
          // { Adresse: { contains: key } },
          //{ NumTel: { contains: key } },
        ],
      }
      : {};

    return this.prismaService.expert.findMany({
      where: keyword,
      select: {
        firstName: true,
        lastName: true,
        email: true,
        tel: true,
        description: true,
        cout: true,
        city: true,
      },
    });
  }

  /*async searchExperts(key: string) {
    const keyword = key
      ? {
          OR: [
            { firstName: { contains: key } },
            { lastName: { contains: key } },
            { email: { contains: key } },
            { city: key }, // Utilisez directement la valeur de la ville pour la recherche exacte
          ],
        }
      : {};
  
    return this.prismaService.expert.findMany({
      where: {
        AND: [
          keyword.OR.length > 0 ? { OR: keyword.OR } : {}, // Utilisez AND pour combiner les filtres
          { isExpert: true }, // Assurez-vous de ne récupérer que les experts
        ],
      },
      select: {
        ide: true,
        firstName: true,
        lastName: true,
        email: true,
        cv: true,
        city: true,
        tel: true,
        description: true,
        cout: true,
        PhotoProfil: true,
      },
    });
  }*/










}
