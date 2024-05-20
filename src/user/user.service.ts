import { BadRequestException, ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from 'src/mailer/mailer.service';
import { DeleteAccountDto } from 'dto/deleteAccountDto';
import * as bcrypt from 'bcrypt';
import { Socket } from 'socket.io';
import { UpdateAccountDto } from 'dto/updateAccountDto';
import { Publication, User } from '@prisma/client';
import { Notification } from '@prisma/client';
import { NotificationService } from 'src/notification/notification.service';
import { InscriptionDto } from 'dto/inscriptionDto';
export interface UserWithoutPassword extends Omit<User, 'MotDePasse'> { }
export type AdminUserCreateInput = {
  email: string;
  MotDePasse: string;
  PhotoProfil: string;
  isAdmin: boolean;
};
@Injectable()
export class UserService {

  constructor(private readonly prismaService: PrismaService, private readonly notificationService: NotificationService) { }

  /* async createAdminUser(createAdminUserDto: CreateAdminUserDto) {
       const adminUserDto = plainToClass(CreateAdminUserDto, createAdminUserDto);
     
       const errors = await validate(adminUserDto);
     
       if (errors.length > 0) {
         throw new BadRequestException('Invalid input');
       }
     
       const hashedPassword = await bcrypt.hash(createAdminUserDto.MotDePasse, 10);
     
       return await this.prismaService.user.create({
         data: {
           ...createAdminUserDto,
           MotDePasse: hashedPassword,
           isAdmin: true,
         },
       });
     }*/
  /* async createAdminUser(createAdminUserDto: CreateAdminUserDto): Promise<User> {
     const hashedPassword = await bcrypt.hash(createAdminUserDto.MotDePasse, 10);
   
     return this.prismaService.user.create({
       data: {
         ...createAdminUserDto,
         MotDePasse: hashedPassword,
         isAdmin: true,
         PhotoProfil: 'path/to/photo.jpg',
       },
     });
   }*/

  /*async getUserById(userId: number): Promise<UserWithoutPassword> {
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    // Exclure le champ MotDePasse de l'objet retourné
    const { MotDePasse, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
  async associateProfileImage(payload : any, profileImage: string): Promise<void> {
    // Recherche de l'utilisateur par ID
    const userId = payload ;
    const existingUser = await this.prismaService.user.findUnique({ where: { id: userId} });

    // Vérifier si l'utilisateur existe
    if (!existingUser) {
      throw new NotFoundException('Utilisateur non trouvé');
    }
    // Mettre à jour l'utilisateur avec la photo de profil
    await this.prismaService.user.update({
      where: { id: userId },
      data: { PhotoProfil: profileImage },
    });
  }*/
  async getUserById(payload: any): Promise<UserWithoutPassword> {
    const userId = payload;
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const { MotDePasse, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
  
  async associateProfileImage(userId: number, profileImage: string): Promise<void> {
    const existingUser = await this.prismaService.user.findUnique({ where: { id: userId } });
    if (!existingUser) {
      throw new NotFoundException('Utilisateur non trouvé');
    }
    await this.prismaService.user.update({
      where: { id: userId },
      data: { PhotoProfil: profileImage },
    });
  }
  async deleteAccount(payload: any) {
    const userId = payload;
    const user = await this.prismaService.user.findUnique({ where: { id: userId } })
    if (!user) throw new NotFoundException('User not found')
    await this.prismaService.user.delete({ where: { id: userId } });
    return { data: " User successfully deleted " }
  }

  /* async updateAccount(userId: number, updateAccountDto: UpdateAccountDto) {
       // Validate userId
   if (typeof userId !== 'number' || userId <= 0) {
     throw new BadRequestException('Invalid user ID');
   }
 
   // Validate updateAccountDto
   const errors = await validate(updateAccountDto);
   if (errors.length > 0) {
     throw new BadRequestException('Invalid request data');
   }
     const user = await this.prismaService.user.findUnique({ where: { id: userId } })
     if (!user) throw new NotFoundException('User not found')
     let updateAccount: User
     if (updateAccountDto.MotDePasse) {
       const hash = await bcrypt.hash(updateAccountDto.MotDePasse, 10);
       updateAccount = await this.prismaService.user.update({
         where: { id: userId },
         data: { ...updateAccountDto, MotDePasse: hash },
       });
     }
     else {
       // Si le mot de passe n'est pas fourni, mettez à jour les autres champs sans toucher au mot de passe
       updateAccount = await this.prismaService.user.update({
         where: { id: userId },
         data: { ...updateAccountDto },
       });
     }
     return { message: 'Compte utilisateur mis à jour avec succès.' };
 
   }*/
  async updateAccount(payload: any, updateAccountDto: UpdateAccountDto) {

    const userId = payload;
    const user = await this.prismaService.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    let updateAccount: User;
    if (updateAccountDto.MotDePasse) {
      const hash = await bcrypt.hash(updateAccountDto.MotDePasse, 10);
      updateAccount = await this.prismaService.user.update({
        where: { id: userId },
        data: { ...updateAccountDto, MotDePasse: hash },
      });
    } else {
      // Si le mot de passe n'est pas fourni, mettez à jour les autres champs sans toucher au mot de passe
      updateAccount = await this.prismaService.user.update({
        where: { id: userId },
        data: { ...updateAccountDto },
      });
    }
    return { message: 'Vos informations ont été mises à jour avec succès.' };
  }

  async getProfileImageName(userId: number) {
    // Recherchez l'utilisateur dans la base de données en fonction de son ID
    try {
      // Recherchez l'utilisateur dans la base de données en fonction de son ID
      const user = this.prismaService.user.findUnique({
        where: { id: userId },
        select: { PhotoProfil: true } // Sélectionnez uniquement le champ PhotoProfil
      });

      if (!user || !(await user).PhotoProfil) {
        throw new NotFoundException('Image de profil non trouvée pour cet utilisateur');
      }

      // Retournez le nom de l'image de profil
      return (await user).PhotoProfil;
    } catch (error) {
      throw error;
    }
  }
  async updateProfileImage(payload: any, filename: string): Promise<Object> {
    // Recherche de l'utilisateur dans la base de données
    const userId = typeof payload === 'number' ? payload : parseInt(payload);
    const user = await this.prismaService.user.findUnique({ where: { id: userId } });
    if (!user) {
      // Gérer le cas où l'utilisateur n'est pas trouvé
      throw new NotFoundException('User not found');
    }
    try {
      // Mettre à jour la colonne PhotoProfil de l'utilisateur avec le nom du fichier
      const updatedUser = await this.prismaService.user.update({
        where: { id: userId },
        data: { PhotoProfil: filename },
      });

      return { message: 'Profile image updated successfully' };
    } catch (error) {
      // Gérer les erreurs potentielles
      throw new Error('Failed to update profile image');
    }
  }

// Notification Service
async getNotificationsByUserId(userId: number): Promise<Notification[]> {
  return this.prismaService.notification.findMany({
    where: {
      userId: userId
    },
    orderBy: {
      createdAt: 'desc'
    }
  });
}
  async markNotificationAsRead(notificationId: number): Promise<Notification> {
    try {
      const notification = await this.prismaService.notification.findUnique({
        where: { idn: notificationId },
      });

      if (!notification) {
        throw new Error(
          `Notification avec l'ID ${notificationId} non trouvée.`,
        );
      }

      // Marquer la notification comme lue
      const updatedNotification = await this.prismaService.notification.update({
        where: { idn: notificationId },
        data: { isRead: true },
      });

      return updatedNotification;
    } catch (error) {
      throw new Error(
        `Échec de la mise à jour de la notification : ${error.message}`,
      );
    }
  }

  async demandeCreationCompte(inscriptionDto: InscriptionDto, client : Socket) {
    try {
      const { Nom, Prenom, NumTel, Adresse, email, MotDePasse, Ville, CodePostal, PhotoProfil } = inscriptionDto;
  
      // Vérifier si un compte existe déjà avec cet email
      const existingUser = await this.prismaService.user.findUnique({
        where: { email },
      });
  
      if (existingUser) {
        throw new BadRequestException('Un compte existe déjà avec cet email.');
      }
  
      // Créer une nouvelle demande de création de compte
      const newRequest = await this.prismaService.creationCompteRequest.create({
        data: {
          nom : inscriptionDto.Nom,
          prenom : inscriptionDto.Prenom,
          telephone : inscriptionDto.NumTel,
          adresse : inscriptionDto.Adresse,
          email: inscriptionDto.email,
          motDePasse : inscriptionDto.MotDePasse,
          ville : inscriptionDto.Ville,
          codePostal : inscriptionDto.CodePostal,
          photoProfil: null,
          status: 'en attente',
          admin: { connect: { ida: 1 } },
        },
      });
      const adminId = 1; // ID de l'admin auquel envoyer la demande
      await this.prismaService.creationCompteRequest.update({
        where: { id: newRequest.id },
        data: {
          admin: { connect: { ida: adminId } },
        },
      });
      const notificationContent = {
        nom : inscriptionDto.Nom,
          prenom : inscriptionDto.Prenom,
          telephone : inscriptionDto.NumTel,
          adresse : inscriptionDto.Adresse,
          email: inscriptionDto.email,
          motDePasse : inscriptionDto.MotDePasse,
          ville : inscriptionDto.Ville,
          codePostal : inscriptionDto.CodePostal,
          photoProfil: null,
      };
      console.log(
        'here is notificationContent;',
        JSON.stringify(notificationContent),
      );
      // Envoyer une notification à l'admin
      await this.notificationService.notifierAdminDemandeCreationCompte( notificationContent,
        client);
        console.log('Notification sent to admin successfully.');
      return 'Demande de création de compte envoyée avec succès.';
    } catch (error) {
      throw new Error(error);
    }
  }
}
