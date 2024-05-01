import { Injectable } from '@nestjs/common';
import * as multer from 'multer';
import { PrismaService } from 'src/prisma/prisma.service';
import * as fs from 'fs';
import { CreateExpertDto } from 'dto/createExpertDto';
import * as bcrypt from 'bcrypt';
import { diskStorage } from 'multer';
import { City } from '@prisma/client';
import { FormExpertDto } from 'dto/formExpertDto';
@Injectable()
export class ExpertService {
  constructor(private prisma: PrismaService) { }

  async createExpertRequest(requestData: FormExpertDto, cv: string) {
    try {


      console.log("hii")

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

      return "Demande d'expertise créée avec succès et envoyée à l'administrateur.";
    } catch (error) {
      throw new Error("Une erreur s'est produite lors de la création de la demande d'expertise.");
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




  async confirmRequest(expertReqId: any): Promise<boolean> {
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
        data: { status: 'approuvé' },
      });

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

      return true;
    } catch (error) {
      console.error('Error confirming order:', error);
      return false;
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



