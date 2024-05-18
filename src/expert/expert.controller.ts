import { Body, Controller, Param, Post, UploadedFile, UseInterceptors, Get, Delete, Put, Req, UseGuards, Request, NotFoundException, ParseIntPipe, Res, ForbiddenException } from '@nestjs/common';
import * as multer from 'multer';
import { ExpertService } from './expert.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { FormExpertDto } from 'dto/formExpertDto';
import { MailerService } from 'src/mailer/mailer.service';
import { Socket } from 'socket.io';
import { ExpertGuard } from './expert.guard';
import { UpdateAccountDto } from 'dto/updateAccountDto';
import { Observable, from, of } from 'rxjs';
import path, { join } from 'path';
import { DemandExpertise, ExpertiseStatus, Rapport } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateRapportDto } from 'dto/createRapportDto';
const certifStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/certif');
  },
  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}-${Date.now()}${getExtension(file.mimetype)}`);
  },
});
const upload = multer({ dest: 'uploads/certif' });
export const storage = {
  storage: multer.diskStorage({
    destination: './uploads/profileimages',
    filename: (req, file, cb) => {
      console.log('Configuration du stockage :', file);
      let splitedName = file.originalname.split('.')
      const filename: string = splitedName[0];
      const extention: string = file.mimetype.split('/')[1];;
      cb(null, `${filename}.${extention}`);
    }
  }),
}
@Controller('expert')
export class ExpertController {
  constructor(private readonly expertService: ExpertService, private readonly mailerService: MailerService, private readonly prismaService: PrismaService) { }

  @Post('demandExp')
  @UseInterceptors(FileInterceptor('cv', { dest: 'uploads/certif' }))
  async createExpertRequest(
    @UploadedFile() cv,
    @Body() requestData: FormExpertDto,
    @Req() req: any
  ) {
    const client: Socket = req;
    return this.expertService.createExpertRequest(requestData, cv.originalname, client);
  }

  /*@Get('demand/:id')
  async getExpertRequest(@Param('id') id: number) {
    return this.expertService.getExpertRequest(id);
  }
  @Put('demand/:id')
  @UseInterceptors(FileInterceptor('cv', { dest: 'uploads/certif' }))
  async updateExpertRequest(
    @Param('id') id: number,
    @UploadedFile() cv: Express.Multer.File,
    @Body() requestData: FormExpertDto,
  ) {
    return this.expertService.updateExpertRequest(id, requestData, cv.filename);
  }

  @Delete('demand/:id')
  async deleteExpertRequest(@Param('id') id: number) {
    return this.expertService.deleteExpertRequest(id);
  }*/
  @UseGuards(ExpertGuard)
  @Put("update-account")
  update(@Req() request: any,
    @Body() updateAccountDto: UpdateAccountDto,
  ): Promise<any> {
    const payload = request.user;
    console.log("PAYYYYYY", payload)
    const expertId = payload.sub;

    return this.expertService.updateAccount(expertId, updateAccountDto)
  }
  @UseGuards(ExpertGuard)
  @Post('upload')
  @UseInterceptors(FileInterceptor('file', storage))
  async uploadFile(@UploadedFile() file, @Req() request: any): Promise<Observable<Object>> {
    const payload = request.user;
    const adminId = payload.sub;
    const adminExists = await this.expertService.getExpertById(adminId);
    if (!adminExists) {
      throw new NotFoundException('Utilisateur non trouvé');
    }
    await this.expertService.associateProfileImage(adminId, file.filename);
    return of({ imagePath: file.filename });
  }

  @Get('profile-image/:id')
  async findProfileImage(@Param('id', ParseIntPipe) adminId: number, @Res() res): Promise<void> {
    // Récupérez le nom de l'image à partir de la base de données en fonction de l'ID de l'utilisateur
    try {
      const imageName = await this.expertService.getProfileImageName(adminId);
      // Envoyez le fichier correspondant en réponse
      res.sendFile(join(process.cwd(), 'uploads/profileimages/' + imageName));
    }
    catch (error) {
      if (error instanceof NotFoundException) {
        res.status(404).send(error.message);
      } else {
        res.status(500).send('Une erreur interne s\'est produite');
      }
    }
  }


  @UseGuards(ExpertGuard)
  @Put('update-profile-image')
  @UseInterceptors(FileInterceptor('file', storage))
  updateProfileImage(@UploadedFile() file, @Req() request: any): Observable<Object> {
    const payload = request.user;
    const adminId = payload.sub;
    return from(this.expertService.updateProfileImage(adminId, file.filename));
  }
  @UseGuards(ExpertGuard)
  @Post(':idee/confirmer')
  async accepterDemande(
    @Param('idee', ParseIntPipe) demandeId: number,
    @Req() request: any,
  ): Promise<DemandExpertise> {
    const payload = request.user;
    const expertId = payload.sub;
    // Vérifier si l'expert est bien lié à la demande d'expertise
    const demande = await this.prismaService.demandExpertise.findUnique({
      where: { idde: demandeId },
      include: { expert: true },
    });

    if (!demande || demande.expert.ide !== expertId) {
      throw new ForbiddenException('Vous n\'êtes pas autorisé à mettre à jour cette demande d\'expertise.');
    }
    return this.expertService.updateDemandeStatus(demandeId, ExpertiseStatus.ACCEPTE, expertId);
  }

  @UseGuards(ExpertGuard)
  @Post(':idee/refuser')
  async refuserDemande(
    @Param('idee', ParseIntPipe) demandeId: number,
    @Req() request: any,
  ): Promise<DemandExpertise> {
    const payload = request.user;
    const expertId = payload.sub;
    // Vérifier si l'expert est bien lié à la demande d'expertise
    const demande = await this.prismaService.demandExpertise.findUnique({
      where: { idde: demandeId },
      include: { expert: true },
    });

    if (!demande || demande.expert.ide !== expertId) {
      throw new ForbiddenException('Vous n\'êtes pas autorisé à mettre à jour cette demande d\'expertise.');
    }
    return this.expertService.updateDemandeStatus(demandeId, ExpertiseStatus.REJETE, expertId);
  }

  @UseGuards(ExpertGuard)
  @Post(':expertiseId/rapport')
  async createRapport(@Param('expertiseId', ParseIntPipe) expertiseId: number, @Body() rapportData: CreateRapportDto, @Req() request: any) {
    const payload = request.user;
    const expertId = payload.sub;

    return this.expertService.createRapport(expertiseId, rapportData, expertId);
  }

  /*@UseGuards(ExpertGuard)
  @Get('expertises/:expertiseId/rapport')
  async getRapportParExpertise(
    @Param('expertiseId', ParseIntPipe) expertiseId: number,
    @Req() request: any
  ): Promise<Rapport> {
    const payload = request.user;
    const expertId = payload.sub;
    return this.expertService.getRapportParExpertise(expertiseId, expertId);
  }*/

  /*@UseGuards(ExpertGuard)
  @Get('expertise/:expertiseId/rapport')
    async getRapport(@Param('expertiseId', ParseIntPipe) expertiseId: number,@Req() request: any): Promise<Rapport> {
      const payload = request.user;
      const expertId = payload.sub;
      return this.expertService.getRapportByExpertiseId(expertiseId);
    }*/
  @UseGuards(ExpertGuard)
  @Get('expertise/:expertiseId/rapport')
  async getRapport(@Param('expertiseId', ParseIntPipe) expertiseId: number, @Req() request: any) {
    const payload = request.user;
    const expertId = payload.sub;

    const rapport = await this.expertService.getRapportByExpertiseId(expertiseId, expertId);

    if (!rapport) {
      throw new ForbiddenException('Access denied');
    }

    return rapport;
  }

  @UseGuards(ExpertGuard)
  @Get('rapports')
  async getRapports(@Req() request: any) {
    const payload = request.user;
    const expertId = payload.sub;

    return this.expertService.getRapportsParExpert(expertId);
  }

  @UseGuards(ExpertGuard)
  @Get('expertises')
  async getExpertises(@Req() request: any) {
    const payload = request.user;
    const expertId = payload.sub;

    return this.expertService.getExpertisesByExpert(expertId);
  }









}
function getExtension(mimetype: string): string {
  switch (mimetype) {
    case 'image/jpeg':
    case 'image/png':
      return '.png';
    case 'application/pdf':
      return '.pdf';
    default:
      return '.bin';
  }





  /*@Post()
@UseInterceptors(FileInterceptor('cv', { dest: 'uploads/certificates' }))
async createExpert(
  @UploadedFile() file: Express.Multer.File,
  createExpertDto: CreateExpertDto,
): Promise<void> {
  try {
    await this.expertService.createExpert(createExpertDto, file);
    // Send a notification to the admin
  } catch (error) {
    // Handle the error
  }
}*/
  /*
    @Post('accept/:id')
    async acceptExpertApplication(
      @Param('id') id: number,
      @Body() createExpertDto: CreateExpertDto,
    ): Promise<void> {
      try {
        // Generate a random password
        const password = Math.random().toString(36).slice(-8);
  
        // Create the expert
        const expert = await this.expertService.createExpert(createExpertDto, null, password, id);
  
        // Send an acceptance email to the expert
        const transporter = nodemailer.createTransport({
          host: 'smtp.example.com',
          port: 587,
          secure: false, // true for 465, false for other ports
          auth: {
            user: 'admin@example.com',
            pass: 'password',
          },
        });
  
        const mailOptions = {
          from: 'admin@example.com',
          to: createExpertDto.email,
          subject: 'Expert Application Accepted',
          text: `Your expert application has been accepted. Your account credentials are:
  
  Email: ${createExpertDto.email}
  Password: ${password}`,
        };
  
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.log(error);
          } else {
            console.log(`Email sent: ${info.response}`);
          }
        });
      } catch (error) {
        // Handle the error
        console.log(error);
      }
    }
  
    @Post('reject/:id')
    async rejectExpertApplication(
      @Param('id') id: number,
      @Body() createExpertDto: CreateExpertDto,
    ): Promise<void> {
      try {
        // Send a rejection email to the expert
        const transporter = nodemailer.createTransport({
  host: 'smtp.example.com',
          port: 587,
          secure: false, // true for 465, false for other ports
          auth: {
            user: 'admin@example.com',
            pass: 'password',
          },
        });
  
        const mailOptions = {
          from: 'admin@example.com',
          to: createExpertDto.email,
          subject: 'Expert Application Rejected',
          text: 'Your expert application has been rejected.',
        };
  
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.log(error);
          } else {
            console.log(`Email sent: ${info.response}`);
          }
        });
      } catch (error) {
        // Handle the error
        console.log(error);
      }
    }
  }*/






}



