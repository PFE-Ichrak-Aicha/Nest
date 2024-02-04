import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePubDto } from 'dto/createPubDto';
import { UpdatePubDto } from 'dto/updatePubDto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PubService { 
    constructor(private readonly prismaService : PrismaService) {}
    async  getAll() {
        return await this.prismaService.publication.findMany({
            include : {
                user : {
                    select :{
                        Nom : true,
                        Prenom :true,
                        email : true,
                        NumTel : true,
                        Ville : true,
                        Adresse : true
                    }
                }
            }
        })
    }
    async create(createPubDto: CreatePubDto, userId: number) {
        const {marque ,model,anneeFabrication, nombrePlace,couleur,kilometrage,prix, descrption,  typeCarburant} = createPubDto
     await this.prismaService.publication.create ({ data : {
        marque ,model,anneeFabrication, nombrePlace,couleur,kilometrage,prix, descrption,  typeCarburant , userId
    }})
    return { data : " Publication crée "} 
    }

    async delete(pubid: number, userId: number) {
      const publication =  await this.prismaService.publication.findUnique({where : {pubid}})
      if (!publication) throw new NotFoundException("Publication not found")
      // vérification de l'utilisateur qui essaie de supprimer la publication
      if ( publication.userId != userId ) throw new ForbiddenException ("Forbidden action")
     await this.prismaService.publication.delete({where : {pubid}})
     return { data : "Publication supprimée"}
    }
    async update(pubid: number, userId: any , updatePubDto :UpdatePubDto) {
        const publication =  await this.prismaService.publication.findUnique({where : {pubid}})
        if (!publication) throw new NotFoundException("Publication not found")
         // vérification de l'utilisateur qui essaie de supprimer la publication
      if ( publication.userId != userId ) throw new ForbiddenException ("Forbidden action")
      await this.prismaService.publication.update({ where : {pubid} , data : {...updatePubDto} })
     return  {data :"Publication modifiée !"}
    }
   
}
