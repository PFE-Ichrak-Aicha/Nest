import { Controller, Param, ParseIntPipe } from '@nestjs/common';
import { AdminGuard } from 'src/auth/admin.guard';
import { AdminService } from './admin.service';
import { Body, Req, UseGuards, Delete, Put, Post, UseInterceptors, UploadedFile, Get, Query, BadRequestException } from '@nestjs/common';
import { Publication, Subscription, TypeCarburant } from '@prisma/client';
import { Request } from 'express';
import { User } from '@prisma/client';
import { CreateSubscriptionDto } from 'dto/createSubscriptionDto';
import { UpdateSubscriptionDto } from 'dto/updateSubscriptionDto';
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

@Controller('admin')
export class AdminController {
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
  @Post("Subscription")
  async createSubscription(
    @Body()createSubscriptionDto : CreateSubscriptionDto 
  ) {
    //const userId = request.user["id"]
    return this.adminService.createSubscription(createSubscriptionDto);
  }

//mochkla
  @UseGuards(AdminGuard)
  @Get("subscriptions")
  async getAllSubscriptions() : Promise <Partial<Subscription>[] >{
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



}
