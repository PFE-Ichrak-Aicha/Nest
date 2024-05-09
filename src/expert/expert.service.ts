import { Injectable } from '@nestjs/common';
import * as multer from 'multer';
import { PrismaService } from 'src/prisma/prisma.service';
import { Socket } from 'socket.io'
import { FormExpertDto } from 'dto/formExpertDto';
import { NotificationGateway } from 'src/notification/notification.gateway';
import { NotificationService } from 'src/notification/notification.service';
import { MailerService } from 'src/mailer/mailer.service';


@Injectable()
export class ExpertService {
  constructor(private prisma: PrismaService, private readonly notificationGateway: NotificationGateway, private readonly notificationService: NotificationService, private readonly mailerService: MailerService) { }

  async createExpertRequest(requestData: FormExpertDto, cv: string, client: Socket) {
    try {
      const newRequest = await this.prisma.expertRequest.create({
        data: {
          firstName: requestData.firstName,
          lastName: requestData.lastName,
          email: requestData.email,
          telephone: requestData.tel,
          cv: cv,
          city: requestData.city,
          status: "en attente",
          admin: { connect: { ida: 1 } }
        }
      });
      // Envoyer la demande à l'admin (ici on suppose qu'il y a un admin avec l'ID 1)
      const adminId = 1; // ID de l'admin auquel envoyer la demande
      await this.prisma.expertRequest.update({
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
















  async updateExpertRequest(id: number, requestData: FormExpertDto, cv: string) {
    try {
      await this.prisma.expertRequest.update({
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
      await this.prisma.expertRequest.delete({
        where: { ider: id }
      });

      return "Demande d'expertise supprimée avec succès.";
    } catch (error) {
      throw new Error("Une erreur s'est produite lors de la suppression de la demande d'expertise.");
    }
  }

  async getExpertRequest(id: number) {
    try {
      const expertRequest = await this.prisma.expertRequest.findUnique({
        where: { ider: id }
      });

      if (!expertRequest) {
        throw new Error("La demande d'expertise n'a pas été trouvée.");
      }

      return expertRequest;
    } catch (error) {
      throw new Error("Une erreur s'est produite lors de la récupération de la demande d'expertise.");
    }
  }


  /* private readonly certifStorage = multer.diskStorage({
      destination: (req, file, cb) => {
          cb(null, 'uploads/certif');
      },
      filename: (req, file, cb) => {
          cb(null, `${file.fieldname}-${Date.now()}${this.getExtension(file.mimetype)}`);
      },
  });

  private readonly upload = multer({ storage: this.certifStorage });
   getExtension(mimetype: string): string {
      switch (mimetype) {
          case 'image/jpeg':
          case 'image/png':
              return '.png';
          case 'application/pdf':
              return '.pdf';
          default:
              return '.bin';
  
      }
  }*/

  /*async createExpert(formExpertDtoExpertDto: CreateExpertDto, file: Express.Multer.File): Promise<void> {
    try {
      // Hash the password
      const hashedPassword = await bcrypt.hash(createExpertDto.passe, 10);
 
      // Store the CV file
      const cvPath = await new Promise<string>((resolve, reject) => {
        this.upload.single('cv')(createExpertDto, (err, file) => {
          if (err) {
            reject(err);
          }
          resolve(file.path);
        });
      });
 
      // Create the expert
      const expert = await this.prisma.expert.create({
        data: {
          firstName: createExpertDto.firstName,
          lastName: createExpertDto.lastName,
          email: createExpertDto.email,
          tel: createExpertDto.tel,
          city: createExpertDto.city,
          passe: hashedPassword,
          cv: fs.readFileSync(cvPath).toString('base64'),
        },
      });
 
      // Delete the CV file
      //fs.unlinkSync(cvPath);
 
      // Send a notification to the admin
    } catch (error) {
      // Handle the error
    }
  }
 
}*/

}



