import { Controller, Param, ParseIntPipe,Request  } from '@nestjs/common';
import { AdminGuard } from 'src/auth/admin.guard';
import { AdminService } from './admin.service';
import { Body, Req, UseGuards, Delete, Put, Post,  Get, Query, BadRequestException } from '@nestjs/common';
import { Publication, Subscription, TypeCarburant } from '@prisma/client';
import { User } from '@prisma/client';
import { CreateSubscriptionDto } from 'dto/createSubscriptionDto';
import { UpdateSubscriptionDto } from 'dto/updateSubscriptionDto';
import { UpdateAccountDto } from 'dto/updateAccountDto';
import { Notification } from '@prisma/client';

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
@UseGuards(AdminGuard)
@Controller('admin')
export class AdminController {
  prismaService: any;
  authService: any;
  constructor(private readonly adminService: AdminService) { }

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
  ): Promise<Publication[]> {
    return await this.adminService.searchPublications(query);
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

    return {
      message: 'Welcome to the admin dashboard',
      totalUsers,
      totalPublications,
    };
  }

  @UseGuards(AdminGuard)
  //@UseGuards(AuthGuard)
  @Post("Subscription")
  async createSubscription(
    @Body() createSubscriptionDto: CreateSubscriptionDto
  ) {
    //const userId = request.user["id"]
    return this.adminService.createSubscription(createSubscriptionDto);
  }

  //mochkla
  //@UseGuards(AdminGuard)
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

  /*@Put("update-account")
  update(@Req() request: Request  & { admin: { ida: number } },
      @Body() updateAccountDto: UpdateAccountDto,
  ) {
      const adminId = request.admin.ida
      return this.adminService.updateAccount(adminId, updateAccountDto)
  }*/

  @UseGuards(AdminGuard)
  @Put('updateAdmin')
  async updateAdminAccount(
    @Request() req: any,
    @Body() updateAccountDto: UpdateAccountDto,
  ): Promise<any> {
    const adminId = req.user.sub; 
    console.log("Admin",req.user)
    
    return this.adminService.updateAdmin(adminId, updateAccountDto);
  }

  @Get('notifications/:adminId')
  async getAdminNotifications(@Param('adminId') adminId: number): Promise<Notification[]> {
    return this.adminService.getAdminNotifications(adminId);
  }










  /*@UseGuards(AdminGuard)
  @Put('updateAdmin')
  async updateAdmin(@GetAdmin() admin: { ida: number }, @Body() updateAccountDto: UpdateAccountDto) {
      // Vérifier si l'admin est authentifié
      //console.log('Request:', request);
      //console.log('Request Admin:', request.admin);
      //if (request.admin) {
        //  const adminId = request.admin.ida; // Accédez à ida à partir de request.admin
          // Utilisez adminId pour effectuer des opérations de mise à jour
          try {
              const result = await this.adminService.updateAdmin(admin.ida, updateAccountDto);
              return { message: 'Vos informations ont été mises à jour avec succès.' };
          }catch (error) {
              // Gérer les erreurs lors de la mise à jour des informations
              console.error('Error updating admin:', error);
              throw new Error('Une erreur est survenue lors de la mise à jour de vos informations.');
          }
        }else {
          // Si l'admin n'est pas authentifié, renvoyer une erreur non autorisée
          console.error('Unauthorized: Admin not authenticated');
    throw new UnauthorizedException('Vous devez être connecté en tant qu\'administrateur pour effectuer cette opération.');
  }*/

  }




