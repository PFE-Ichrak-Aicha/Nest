import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Publication, User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { CreateSubscriptionDto } from 'dto/createSubscriptionDto';
import { UpdateSubscriptionDto } from 'dto/updateSubscriptionDto';
//import { PublicationWhereInput } from '@prisma/client';



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
  constructor(private readonly prismaService: PrismaService,) { }
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



  async getUserById(userId: number): Promise<{ Nom: string, Prenom: string , email: string, NumTel: string, Ville :string,Adresse : string, PhotoProfil:string}> {
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
  


  async getAdminDashboard(): Promise<User[]> {
    return this.prismaService.user.findMany({
      where: {
        isAdmin: true,
      },
    });
  }
  async getTotalUsers(): Promise<number> {
    const totalUsers = await this.prismaService.user.count();
    return totalUsers;
  }
  async getTotalPublications(): Promise<number> {
    const totalPublications = await this.prismaService.publication.count();
    return totalPublications;
  }


  async createSubscription(createSubscriptionDto : CreateSubscriptionDto,userId : number) {
    const {name,duration,price,description }= createSubscriptionDto;
    
    await this.prismaService.subscription.create({
      data: {
        name,
        duration,
        price,
        description,
        userId
      },
    });
    return{ data : "Abonnement crée"}
  }

  async updateSub(ids : number, userId : any, updateSubscriptionDto : UpdateSubscriptionDto){
  const subscription = await this.prismaService.subscription.findUnique({where:{ids}});
  if (!subscription) throw new NotFoundException("subscription not found")
  await this.prismaService.subscription.update({where: {ids}, data: { ...updateSubscriptionDto}})
return { data: "Abonnement modifié"}
}

async deleteSub(ids : number , userId: number){
  const subscription = await this.prismaService.subscription.findUnique({where:{ids}});
  if (!subscription) throw new NotFoundException("subscription not found")
  if (subscription.userId != userId) throw new ForbiddenException("Forbidden action")
  await this.prismaService.subscription.delete({ where: { ids } })
52953081
}
}
