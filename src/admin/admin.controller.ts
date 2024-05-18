import { Controller, Param, ParseIntPipe, Request, UploadedFile, UseInterceptors } from '@nestjs/common';
import { AdminGuard } from 'src/auth/admin.guard';
import { AdminService } from './admin.service';
import { Body, Req, UseGuards, Delete, Put, Post, Get, Query, BadRequestException } from '@nestjs/common';
import { BoiteVitesse, City, Expert, Publication, Sellerie, Subscription, TypeCarburant } from '@prisma/client';
import { User } from '@prisma/client';
import { CreateSubscriptionDto } from 'dto/createSubscriptionDto';
import { UpdateSubscriptionDto } from 'dto/updateSubscriptionDto';
import { UpdateAccountDto } from 'dto/updateAccountDto';
import { Notification } from '@prisma/client';
import { ExpertRequest } from '@prisma/client';
import { Res } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common';
import { NotificationService } from 'src/notification/notification.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Observable, from, of } from 'rxjs';
import * as multer from 'multer';
import path, { join } from 'path';
import { PubService } from 'src/pub/pub.service';
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
interface AdminRequest extends Request {
  admin?: {
    ida: string;
  };
}
interface CustomRequest extends Request {
  admin: {
    ida: number; // Assurez-vous que le type de ida est correct
    // Autres propriétés de l'administrateur si nécessaire
  }
}
export const adstorage = {
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

//@UseGuards(AdminGuard)
@Controller('admin')
export class AdminController {
  prismaService: any;
  authService: any;
  constructor(private readonly adminService: AdminService, private readonly notificationService: NotificationService, private readonly pubService :PubService) { }

  @UseGuards(AdminGuard)
  @Get("ListeUsers")
  async getUsers(): Promise<Partial<User>[]> {
    const users = await this.adminService.getUsers();
    return users;
  }


  @UseGuards(AdminGuard)
  @Get('Listepublications')
  async getAllPublications(): Promise<Partial<Publication>[]> {
    const publications = await this.adminService.getAllPublications();
    return publications;
  }


  @UseGuards(AdminGuard)
  @Get("search-users")
  search(@Query('key') key: string) {
    if (key) {
      return this.adminService.searchUsers(key);
    }

    throw new BadRequestException('Missing key query parameter');
  }

  @UseGuards(AdminGuard)
  @Get("search-publications")
  async searchPublicationsByQuery(
    @Query('q') query: string,
    @Query('marque') marque: string,
    @Query('model') model: string,
    @Query('couleur') couleur: string,
    @Query('anneeMin') anneeMin: string,
    @Query('anneeMax') anneeMax: string,
    @Query('nombrePlace') nombrePlace: string,
    @Query('prixMin') prixMin: string,
    @Query('prixMax') prixMax: string,
    @Query('city') city: City,
    @Query('boiteVitesse') boiteVitesse: BoiteVitesse,
    @Query('typeCarburant') typeCarburant: string,
    @Query('sellerie') sellerie: Sellerie,
    @Query('equippement') equippement: string,
  ): Promise<Publication[]> {
    const anneeMinNumber = parseInt(anneeMin);
    const anneeMaxNumber = parseInt(anneeMax);
    const nombrePlaceNumber = parseInt(nombrePlace);
    const prixMinNumber = parseInt(prixMin);
    const prixMaxNumber = parseInt(prixMax);
    
    return await this.adminService.searchPublications(query, marque, model, couleur, anneeMinNumber, anneeMaxNumber, nombrePlaceNumber, prixMinNumber, prixMaxNumber , city, boiteVitesse, typeCarburant, sellerie, equippement);
    
  }


  @UseGuards(AdminGuard)
  @Get('getPubs/:pubid')
  async getPublicationById(@Param('pubid', ParseIntPipe) pubId: number) {
    return this.adminService.getPubById(pubId);
  }

  @UseGuards(AdminGuard)
  @Get('users/:id')
  async getUsrById(@Param('id', ParseIntPipe) userId: number) {
    return this.adminService.getUserById(userId);
  }


  @UseGuards(AdminGuard)
  @Get("dashboard")
  async adminDashboard(): Promise<any> {
    const totalUsers = await this.adminService.getTotalUsers();
    const totalPublications = await this.adminService.getTotalPublications();
    const totalExperts = await this.adminService.getTotalExperts();
    const totalExpertsRequests = await this.adminService.getTotalExperts();
    const TotalDemandExpertises = await this.adminService.getTotalDemandExpertises();
    const totalAcceptedExpertises = await this.adminService.getCountAcceptedExpertises();
    const totalRejectedExpertises = await this.adminService.getCountRejectedExpertises();
    const totalEn_AttenteExpertises = await this.adminService.getCountEnAttentExpertises();
    return {
      message: 'Welcome to the admin dashboard',
      totalUsers,
      totalPublications,
      totalExperts,
      totalExpertsRequests,
      TotalDemandExpertises,
      totalAcceptedExpertises,
      totalRejectedExpertises,
      totalEn_AttenteExpertises
    };
  }

  @UseGuards(AdminGuard)
  @Post("Subscription")
  async createSubscription(
    @Body() createSubscriptionDto: CreateSubscriptionDto
  ) {
    return this.adminService.createSubscription(createSubscriptionDto);
  }

  //mochkla

  @Get("subscriptions")
  async getAllSubscriptions(): Promise<Partial<Subscription>[]> {
    const Subscriptions = await this.adminService.getAllSubscriptions();
    return Subscriptions
  }

  @UseGuards(AdminGuard)
  @Get('subscription/:ids')
  async getSubscriptionById(@Param('ids', ParseIntPipe) id: number) {
    return this.adminService.getSubscriptionById(id);
  }


  @UseGuards(AdminGuard)
  @Put("updateSub/:ids")
  updateSub(@Param("ids", ParseIntPipe) ids: number,
    @Body() updateSubscriptionDto: UpdateSubscriptionDto,) {
    return this.adminService.updateSub(ids, updateSubscriptionDto)
  }


  @UseGuards(AdminGuard)
  @Delete('deleteSub/:ids')
  async deleteSubscription(@Param('ids', ParseIntPipe) id: number) {
    return this.adminService.deleteSubscription(id);
  }

  

  @UseGuards(AdminGuard)
  @Get('notifications')
  async getAdminNotifications(@Request() req: any): Promise<Notification[]> {
    const adminId = req.user.sub;
    console.log("Admin", req.user)
    return this.adminService.getAdminNotifications(adminId);
  }

  @UseGuards(AdminGuard)
  @Get('notifications/:id')
  async getNotificationByIdAndMarkAsRead(@Param('id') id: number): Promise<Notification> {
    const notification = await this.adminService.getNotificationByIdAndMarkAsRead(id);
    return notification;
  }

  @UseGuards(AdminGuard)
  @Get('notifications/:id/cv')
  async getCVFromNotification(@Param('id', ParseIntPipe) id: number, @Res() res): Promise<void> {
    const cvContent = await this.adminService.getCVFromNotification(id);
    res.sendFile(cvContent.path, { root: '.' });
  }

  @UseGuards(AdminGuard)
  @Post(':ider/confirm')
  async confirmReq(@Param('ider') ider: number): Promise<{ success: boolean }> {
    const success = await this.adminService.confirmRequest(ider);
    return { success };
  }

  @UseGuards(AdminGuard)
  @Post(':ider/refuse')
  async refuseReq(@Param('ider') ider: number): Promise<{ success: boolean }> {
    const success = await this.adminService.refuseRequest(ider);
    return { success };
  }

  @UseGuards(AdminGuard)
  @Get('experts')
  async getAllExperts(): Promise<Expert[]> {
    return this.adminService.getAllExperts();
  }
  //@UseGuards(AdminGuard)
  @Get('experts/:id')
  async getExpertById(@Param('id') id: number): Promise<Expert> {
    return this.adminService.getExpertById(id);
  }

  @UseGuards(AdminGuard)
  @Get('expert-requests')
  async getAllExpertRequests(): Promise<ExpertRequest[]> {
    return this.adminService.getAllExpertRequests();
  }

  @UseGuards(AdminGuard)
  @Get('expert-request/:id')
  async getExpertRequestByID(@Param('id') id: number): Promise<ExpertRequest> {
    return this.adminService.getExpertRequestById(id);
  }

  @UseGuards(AdminGuard)
  @Put("update_adaccount")
  update(@Req() request: any,
    @Body() updateAccountDto: UpdateAccountDto,
  ): Promise<any> {
    const payload = request.user;
    console.log("PAYYYYYY", payload)
    const adminId = payload.sub;
    return this.adminService.updateAccount(adminId, updateAccountDto)
  }

  @UseGuards(AdminGuard)
  @Post('upload')
  @UseInterceptors(FileInterceptor('file', adstorage))
  async uploadFile(@UploadedFile() file, @Req() request: any): Promise<Observable<Object>> {
    const payload = request.user;
    const adminId = payload.sub;
    const adminExists = await this.adminService.getAdminById(adminId);
    if (!adminExists) {
      throw new NotFoundException('Utilisateur non trouvé');
    }
    await this.adminService.associateProfileImage(adminId, file.filename);
    return of({ imagePath: file.filename });
  }

  @Get('profile-image/:id')
  async findProfileImage(@Param('id', ParseIntPipe) adminId: number, @Res() res): Promise<void> {
    // Récupérez le nom de l'image à partir de la base de données en fonction de l'ID de l'utilisateur
    try {
      const imageName = await this.adminService.getProfileImageName(adminId);
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


  @UseGuards(AdminGuard)
  @Put('update-profile-image')
  @UseInterceptors(FileInterceptor('file', adstorage))
  updateProfileImage(@UploadedFile() file, @Req() request: any): Observable<Object> {
    const payload = request.user;
    const adminId = payload.sub;
    return from(this.adminService.updateProfileImage(adminId, file.filename));
  }

  /*@UseGuards(AdminGuard)
    @Get("search-users")
    searchexpert(@Query('key') key: string) {
      if (key) {
        return this.adminService.searchExperts(key);
      }
  
      throw new BadRequestException('Missing key query parameter');
    }*/
  @UseGuards(AdminGuard)
  @Get("search-experts")
  searchExperts(@Query('key') key: string) {
    if (key) {
      return this.adminService.searchExperts(key);
    }

    throw new BadRequestException('Missing key query parameter');
  }












}




