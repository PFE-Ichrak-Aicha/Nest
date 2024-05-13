import { Injectable, NotFoundException } from '@nestjs/common';
import * as multer from 'multer';
import { PrismaService } from 'src/prisma/prisma.service';
import { Socket } from 'socket.io'
import { FormExpertDto } from 'dto/formExpertDto';
import { NotificationGateway } from 'src/notification/notification.gateway';
import { NotificationService } from 'src/notification/notification.service';
import { MailerService } from 'src/mailer/mailer.service';
import { UpdateAccountDto } from 'dto/updateAccountDto';
import * as bcrypt from 'bcrypt';
import { Expert } from '@prisma/client';


@Injectable()
export class ExpertService {
  constructor(private prismaService: PrismaService, private readonly notificationGateway: NotificationGateway, private readonly notificationService: NotificationService, private readonly mailerService: MailerService) { }

  async createExpertRequest(requestData: FormExpertDto, cv: string, client: Socket) {
    try {
      const newRequest = await this.prismaService.expertRequest.create({
        data: {
          firstName: requestData.firstName,
          lastName: requestData.lastName,
          email: requestData.email,
          telephone: requestData.tel,
          cv: cv,
          city: requestData.city,
          description : requestData.description,
          cout: requestData.cout,
          status: "en attente",
          admin: { connect: { ida: 1 } },

        }
      });
      // Envoyer la demande à l'admin (ici on suppose qu'il y a un admin avec l'ID 1)
      const adminId = 1; // ID de l'admin auquel envoyer la demande
      await this.prismaService.expertRequest.update({
        where: { ider: newRequest.ider },
        data: {
          admin: { connect: { ida: adminId } }
        }
      });
      // Générer le lien vers le fichier CV
      const cvLink = `http://localhost:3000/uploads/certif/${cv}`;

      // Créer le contenu de la notification avec le lien vers le CV
      const notificationContent = {
        firstName: requestData.firstName,
        lastName: requestData.lastName,
        email: requestData.email,
        telephone: requestData.tel,
        city: requestData.city,
        description : requestData.description,
        cout: requestData.cout,
        cv: cv,
        cvLink
      };
    //  const notificationContentString = JSON.stringify(notificationContent);
      console.log("here is notificationContent;", JSON.stringify(notificationContent))
      await this.notificationService.createNotificationToAdmin(notificationContent, client);
      console.log("Notification sent to admin successfully.");
      return "Demande d'expertise créée avec succès et envoyée à l'administrateur.";
     
    } catch (error) {
      console.error("Error creating expert request:", error);
      throw new Error(error);

    }
  }

  async updateAccount(payload: any, updateAccountDto: UpdateAccountDto) {
    // Récupérer l'administrateur à partir de son ID
    const expertId = payload;
    const expert = await this.prismaService.expert.findUnique({ where: { ide: expertId } });
    if (!expert) {
        throw new NotFoundException('Expert not found');
    }

    // Mettre à jour les informations de l'administrateur
    let updateAccount: Expert;
    if (updateAccountDto.passe) {
        const hash = await bcrypt.hash(updateAccountDto.passe, 10);
        updateAccount = await this.prismaService.expert.update({
            where: { ide: expertId },
            data: { ...updateAccountDto, passe: hash },
        });
    } else {
        updateAccount = await this.prismaService.expert.update({
            where: { ide: expertId },
            data: { ...updateAccountDto },
        });
    }

    // Retourner un message de succès après la mise à jour
    return { message: 'Vos informations ont été mises à jour avec succès.' };
}

async getExpertById(payload: any): Promise<Expert> {
  const expertId = payload;
  const expert = await this.prismaService.expert.findUnique({
    where: { ide:expertId },
  });
  if (!expert) {
    throw new NotFoundException('User not found');
  }
  const { passe, ...userWithoutPassword } = expert;
  return expert;
}

async associateProfileImage(expertId: number, profileImage: string): Promise<void> {
  const existingExpert = await this.prismaService.expert.findUnique({ where: { ide: expertId } });
  if (!existingExpert) {
    throw new NotFoundException('Utilisateur non trouvé');
  }
  await this.prismaService.expert.update({
    where: { ide: expertId },
    data: { PhotoProfil: profileImage },
  });
}
async getProfileImageName(expertId: number) {
  // Recherchez l'utilisateur dans la base de données en fonction de son ID
  try {
    // Recherchez l'utilisateur dans la base de données en fonction de son ID
    const expert = this.prismaService.expert.findUnique({
      where: { ide: expertId },
      select: { PhotoProfil: true } // Sélectionnez uniquement le champ PhotoProfil
    });

    if (!expert || !(await expert).PhotoProfil) {
      throw new NotFoundException('Image de profil non trouvée pour cet utilisateur');
    }

    // Retournez le nom de l'image de profil
    return (await expert).PhotoProfil;
  } catch (error) {
    throw error;
  }
}
async updateProfileImage(payload: any, filename: string): Promise<Object> {
  // Recherche de l'utilisateur dans la base de données
  const expertId = typeof payload === 'number' ? payload : parseInt(payload);
  const expert = await this.prismaService.expert.findUnique({ where: { ide: expertId } });
  if (!expert) {
    // Gérer le cas où l'utilisateur n'est pas trouvé
    throw new NotFoundException('User not found');
  }
  try {
    // Mettre à jour la colonne PhotoProfil de l'utilisateur avec le nom du fichier
    const updatedUser = await this.prismaService.expert.update({
      where: { ide: expertId },
      data: { PhotoProfil: filename },
    });

    return { message: 'Profile image updated successfully' };
  } catch (error) {
    // Gérer les erreurs potentielles
    throw new Error('Failed to update profile image');
  }
}










  /*async updateExpertRequest(id: number, requestData: FormExpertDto, cv: string) {
    try {
      await this.prismaService.expertRequest.update({
        where: { ider: id },
        data: {
          firstName: requestData.firstName,
          lastName: requestData.lastName,
          email: requestData.email,
          telephone: requestData.tel,
          cv,
          city: requestData.city
        }
      });

      return "Demande d'expertise mise à jour avec succès.";
    } catch (error) {
      throw new Error("Une erreur s'est produite lors de la mise à jour de la demande d'expertise.");
    }
  }

  async deleteExpertRequest(id: number) {
    try {
      await this.prismaService.expertRequest.delete({
        where: { ider: id }
      });

      return "Demande d'expertise supprimée avec succès.";
    } catch (error) {
      throw new Error("Une erreur s'est produite lors de la suppression de la demande d'expertise.");
    }
  }

  async getExpertRequest(id: number) {
    try {
      const expertRequest = await this.prismaService.expertRequest.findUnique({
        where: { ider: id }
      });

      if (!expertRequest) {
        throw new Error("La demande d'expertise n'a pas été trouvée.");
      }

      return expertRequest;
    } catch (error) {
      throw new Error("Une erreur s'est produite lors de la récupération de la demande d'expertise.");
    }
  }*/


}



