import { BadRequestException, ConflictException, ForbiddenException, Injectable, NotFoundException, Res } from '@nestjs/common';
import { City, Publication, TypeCarburant, User } from '@prisma/client';
import { CreatePubDto } from 'dto/createPubDto';
import { UpdatePubDto } from 'dto/updatePubDto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { PubFilterDto } from 'dto/pubFilterDto';
//import { DemandExpertiseCreateInput } from 'path/to/your/prisma/generated/types'; // Update the path accordingly
import { Response } from 'express'
import { contains } from 'class-validator';
import { NotificationService } from 'src/notification/notification.service';
const between = (start: number, end: number) => ({
  gte: start,
  lte: end,
});
function normalizeCityInput(cityInput: string): string {
  return cityInput.toUpperCase();
}
interface Equippement {
  equipid: number;
  name: string;
}
@Injectable()
export class PubService {
  constructor(private readonly prismaService: PrismaService, private readonly notificationService: NotificationService) { }


  async getAll() {
    return await this.prismaService.publication.findMany({
      include: {
        user: {
          select: {
            Nom: true,
            Prenom: true,
            email: true,
            NumTel: true,
            Ville: true,
            Adresse: true
          }
        },
        equippementPublications: {
          include: {
            equippement: {
              select: {
                name: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
  }
  /*async getEquipmentsForPublicationById(publicationId: number) {
    // Récupérer la publication spécifique avec ses équipements
    const publication = await this.prismaService.publication.findUnique({
      where: {
        pubid: publicationId,
      },
      include: {
        equippements: true, // Inclure les équipements liés à la publication spécifique
      },
    });
  
    if (!publication) {
      throw new NotFoundException(`Publication with ID ${publicationId} not found.`);
    }
  
    // Afficher les équipements de la publication spécifique
    console.log(`Equipements de la publication ${publication.pubid}:`);
    publication.equippements.forEach((equippement) => {
      console.log(`- ${equippement.name}`);
    });
  
    return publication.equippements;
  }*/

  async getPubById(pubId: number) {
    const publication = await this.prismaService.publication.findUnique({
      where: { pubid: pubId },

    });
    if (!publication) throw new NotFoundException("Publication not found");
    return publication;
  }




  async getPublicationWithEquipments(pubId: number) {
    const publication = await this.prismaService.publication.findUnique({
      where: { pubid: pubId },
      include: {
        equippementPublications: {
          include: {
            equippement: true,
          }
        }

      },
    });

    if (!publication) throw new NotFoundException('Publication not found');

    return publication;
  }

  /* async create(createPubDto: CreatePubDto, userId: number) {
     const { marque, model, anneeFabrication, nombrePlace, couleur, kilometrage, prix, descrption, typeCarburant, city, boiteVitesse, transmission, carrassorie, sellerie ,equippement, } = createPubDto;
 
     const createdPublication = await this.prismaService.publication.create({
       data: {
         marque, model, anneeFabrication, nombrePlace, couleur, kilometrage, prix, descrption, typeCarburant, userId, city, boiteVitesse, transmission, carrassorie, sellerie, equippement
       },
     });
     return { data: "Publication créée", pubid: createdPublication.pubid };
   }*/
  /*async create(createPubDto: CreatePubDto, userId: number) {
    
    const { marque, model, anneeFabrication, nombrePlace, couleur, kilometrage, prix, descrption, typeCarburant, city, boiteVitesse, transmission, carrassorie, sellerie, equippements } = createPubDto;
   

    const createdPublication = await this.prismaService.publication.create({
      data: {
        marque, model, anneeFabrication, nombrePlace, couleur, kilometrage, prix, descrption, typeCarburant, userId, city, boiteVitesse, transmission, carrassorie, sellerie, 
        equippements: {
          connect: equippements.map((equippementId) => ({ id: equippementId })),
        }
      },
    });
  
    return { data: 'Publication créée', pubid: createdPublication.pubid };
  }*/
  async create(payload: any, createPubDto: CreatePubDto) {
    const userId = payload;
    const user = await this.prismaService.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const { marque, model, anneeFabrication, nombrePlace, couleur, kilometrage, prix, descrption, typeCarburant, city, boiteVitesse, transmission, carrassorie, sellerie, equippements } = createPubDto;
    const existingPublication = await this.prismaService.publication.findFirst({
      where: {
        marque,
        model,
        anneeFabrication,
        nombrePlace,
        couleur,
        kilometrage,
        prix,
        descrption,
        typeCarburant,
        city,
        boiteVitesse,
        transmission,
        carrassorie,
        sellerie,
        userId,
      },
    });

    if (existingPublication) {
      throw new ConflictException('Une publication avec les mêmes informations existe déjà.');
    }
    // Créer la publication sans lier les équipements
    const createdPublication = await this.prismaService.publication.create({
      data: {
        marque,
        model,
        anneeFabrication,
        nombrePlace,
        couleur,
        kilometrage,
        prix,
        descrption,
        typeCarburant,
        city,
        boiteVitesse,
        transmission,
        carrassorie,
        sellerie,
        userId,
        //equippements
      },
    });

    // Créer les relations many-to-many entre la publication et les équipements
    /* await this.prismaService.equippementPublication.createMany({
       data: equippements.map((equippementId) => ({
         publicationId: createdPublication.pubid,
         equippementId,
       })),
     });*/
    const equippementPublicationData = equippements.map((equipid) => ({
      publicationId: createdPublication.pubid,
      equippementId: equipid,
    }));

    await this.prismaService.equippementPublication.createMany({
      data: equippementPublicationData,
    });
    return { data: 'Publication créée', pubid: createdPublication.pubid };
  }

  async associateImagesToPublication(pubId: number, fileNames: string[]): Promise<string[]> {
    const publication = await this.prismaService.publication.findUnique({ where: { pubid: pubId } });
    if (!publication) {
      throw new NotFoundException('Publication not found');
    }
    const images = await Promise.all(fileNames.map(async (fileName) => {
      const image = await this.prismaService.image.create({
        data: {
          path: fileName,
          publication: {
            connect: {
              pubid: pubId,
            },
          },
        },
      });
      return image;
    }));
    const updatedPublication = await this.prismaService.publication.update({
      where: { pubid: pubId },
      data: {
        images: {
          connect: images.map((image) => ({ id: image.id })),
        },
      },
    });
    const imageUrls = images.map((image) => `/uploads/images/${image.path}`);
    return imageUrls;
  }


  async updatePublicationImages(pubId: number, fileNames: string[]): Promise<any> {
    const publication = await this.prismaService.publication.findUnique({ where: { pubid: pubId } });
    if (!publication) {
      throw new NotFoundException('Publication not found');
    }
    // Supprimer les anciennes images associées à la publication
    await this.prismaService.image.deleteMany({ where: { publicationId: pubId } });
    // Créer et associer les nouvelles images à la publication
    const images = await Promise.all(fileNames.map(async (fileName) => {
      const image = await this.prismaService.image.create({
        data: {
          path: fileName,
          publication: {
            connect: {
              pubid: pubId,
            },
          },
        },
      });
      return image;
    }));
    // Mettre à jour la publication pour connecter les nouvelles images
    const updatedPublication = await this.prismaService.publication.update({
      where: { pubid: pubId },
      data: {
        images: {
          connect: images.map((image) => ({ id: image.id })),
        },
      },
      include: { images: true }, // Inclure les images dans le résultat retourné
    });
    return updatedPublication;
  }

  async searchPublications(
    query: string,
    marque?: string,
    model?: string,
    couleur?: string,
    anneeMin?: number,
    anneeMax?: number,
    nombrePlace?: number,
    prixMin?: number,
    prixMax?: number,
    typeCarburant?: TypeCarburant,
    kilometrageMin?: number,
    kilometrageMax?: number,
  ): Promise<Publication[]> {
    const publications = await this.prismaService.publication.findMany({
      where: {

        OR: [
          { marque: { contains: marque } },
          { model: { contains: model } },
          { couleur: { contains: couleur } },
          { anneeFabrication: { gte: anneeMin, lte: anneeMax } },
          { nombrePlace: { gte: nombrePlace } },
          { prix: { gte: prixMin, lte: prixMax } },
          { typeCarburant: { equals: typeCarburant } },
          { kilometrage: { gte: kilometrageMin, lte: kilometrageMax } },
        ],

      },
    });

    return publications;
  }



  async getAllMarques(): Promise<string[]> {
    const marques = await this.prismaService.publication.findMany({
      distinct: ['marque'],
      select: {
        marque: true,
      },
    });
    return marques.map((pub) => pub.marque);
  }


  async getAllModels(): Promise<string[]> {
    const models = await this.prismaService.publication.findMany({
      distinct: ['model'],
      select: {
        model: true,
      },
    });
    return models.map((pub) => pub.model);
  }


  async getAllColors(): Promise<string[]> {
    const colors = await this.prismaService.publication.findMany({
      distinct: ['couleur'],
      select: {
        couleur: true,
      },
    });
    return colors.map((pub) => pub.couleur);
  }


  async getAllTypesCarburant(): Promise<string[]> {
    const fuelTypes = await this.prismaService.publication.findMany({
      distinct: ['typeCarburant'],
      select: {
        typeCarburant: true,
      },
    });
    return fuelTypes.map((pub) => pub.typeCarburant);
  }
  async getAllBoiteVitesse(): Promise<string[]> {
    const boiteVitesse = await this.prismaService.publication.findMany({
      distinct: ['boiteVitesse'],
      select: {
        boiteVitesse: true,
      },
    });
    return boiteVitesse.map((pub) => pub.boiteVitesse);
  }
  async getAllTransmission(): Promise<string[]> {
    const transmission = await this.prismaService.publication.findMany({
      distinct: ['transmission'],
      select: {
        transmission: true,
      },
    });
    return transmission.map((pub) => pub.transmission);
  }
  async getAllCarrassorie(): Promise<string[]> {
    const carrassorie = await this.prismaService.publication.findMany({
      distinct: ['carrassorie'],
      select: {
        carrassorie: true,
      },
    });
    return carrassorie.map((pub) => pub.carrassorie);
  }
  async getAllSellerie(): Promise<string[]> {
    const sellerie = await this.prismaService.publication.findMany({
      distinct: ['sellerie'],
      select: {
        sellerie: true,
      },
    });
    return sellerie.map((pub) => pub.sellerie);
  }
  async getEquipments(): Promise<Equippement[]> {
    try {
      const equipments = await this.prismaService.equippementPublication.findMany({
        where: {
          publicationId: {
            not: undefined,
          },
        },
        select: {
          equippement: {
            select: {
              equipid: true,
              name: true,
            },
          },
        },
      });

      return equipments.map((ep) => ep.equippement);
    } catch (error) {
      throw error;
    }

  }
  /*async getAllEquippements(): Promise<string[]> {
    const equippements = await this.prismaService.publication.findMany({
      distinct: PublicationScalarFieldEnum.equippements,
      select: {
        equippements: true,
      },
    });
    return equippements.map((pub) => pub.equippement);
  }*/

  /*async getAllEquipments():Promise<string[]>{
    const equippement = await this.prismaService.publication.findMany({
      distinct: ['equippements'],
      select: {
        equippements: true,
      }
    })
    return equippement.map((pub) => pub.equippement)
  }*/


  async filterPublications(filterDto: PubFilterDto): Promise<Publication[]> {
    const publications = await this.prismaService.publication.findMany();
    if (filterDto.orderByPrice === 'asc') {
      publications.sort((a, b) => a.prix - b.prix);
    } else if (filterDto.orderByPrice === 'desc') {
      publications.sort((a, b) => b.prix - a.prix);
    }
    if (filterDto.orderByKilometrage === 'asc') {
      publications.sort((a, b) => a.kilometrage - b.kilometrage);
    } else if (filterDto.orderByKilometrage === 'desc') {
      publications.sort((a, b) => b.kilometrage - a.kilometrage);
    }
    return publications;
  }


  /*async delete(pubid: number, userId: number) {
    const publication = await this.prismaService.publication.findUnique({ where: { pubid } })
    if (!publication) throw new NotFoundException("Publication not found")
    // vérification de l'utilisateur qui essaie de supprimer la publication
    if (publication.userId != userId) throw new ForbiddenException("Forbidden action")
    await this.prismaService.publication.delete({ where: { pubid } })
    return { data: "Publication supprimée" }
  }*/


  async deleteWithImages(pubid: number, payload: any) {
    const userId = payload;
    const publication = await this.prismaService.publication.findUnique({
      where: { pubid },
    });
    if (!publication) {
      throw new NotFoundException("Publication not found");
    }
    // verification of the user who is trying to delete the publication
    if (publication.userId != userId) {
      throw new ForbiddenException("Forbidden action");
    }
    // delete all images associated with the publication
    await this.prismaService.image.deleteMany({
      where: {
        publicationId: pubid,
      },
    });

    // Supprimer les relations many-to-many avec les équipements
    await this.prismaService.equippementPublication.deleteMany({
      where: {
        publicationId: pubid,
      },
    });

    // Supprimer la publication
    await this.prismaService.publication.delete({
      where: {
        pubid,
      },
    });

    return { data: 'Publication and associated images deleted' };
  }

  /* async update(pubid: number, payload: any, updatePubDto: UpdatePubDto) {
     const userId = payload;
     const publication = await this.prismaService.publication.findUnique({ where: { pubid } })
     if (!publication) throw new NotFoundException("Publication not found")
     if (publication.userId != userId) throw new ForbiddenException("Forbidden action")
     await this.prismaService.publication.update({ where: { pubid }, data: { ...updatePubDto } })
     return { data: "Publication modifiée !" }
   }*/
  async update(pubid: number, userId: number, updatePubDto: UpdatePubDto) {
    const publication = await this.prismaService.publication.findUnique({
      where: { pubid },
      include: { equippementPublications: true },
    });

    if (!publication) {
      throw new NotFoundException("Publication not found");
    }

    if (publication.userId !== userId) {
      throw new ForbiddenException("Forbidden action");
    }

    const {
      marque,
      model,
      anneeFabrication,
      nombrePlace,
      couleur,
      kilometrage,
      prix,
      descrption,
      typeCarburant,
      city,
      boiteVitesse,
      transmission,
      carrassorie,
      sellerie,
      equippements = [],
    } = updatePubDto;

    // Mettre à jour les informations de la publication
    const updatedPublication = await this.prismaService.publication.update({
      where: { pubid },
      data: {
        marque,
        model,
        anneeFabrication,
        nombrePlace,
        couleur,
        kilometrage,
        prix,
        descrption,
        typeCarburant,
        city,
        boiteVitesse,
        transmission,
        carrassorie,
        sellerie,
      },
    });

    // Mettre à jour les relations many-to-many avec les équipements
    // Supprimer les anciennes relations
    await this.prismaService.equippementPublication.deleteMany({
      where: { publicationId: pubid },
    });

    // Créer les nouvelles relations
    const equippementPublicationData = equippements.map((equippementId) => ({
      publicationId: pubid,
      equippementId,
    }));

    await this.prismaService.equippementPublication.createMany({
      data: equippementPublicationData,
    });

    return { data: "Publication modifiée !" };
  }

  async getPublicationImages(publicationId: number, @Res() res: Response) {
    try {
      const images = await this.prismaService.image.findMany({
        where: {
          publicationId: publicationId,
        },
        select: {
          path: true,
        },
      });

      if (images.length === 0) {
        return res.status(404).json({ error: "No images found for the given publication ID" });
      }

      const imagesPath: { path: string }[] = images.map(item => ({
        path: `http://localhost:3000/uploads/images/${item.path}`
        // path: join(__dirname, '..', 'uploads', 'images', item.path)
      }));

      return res.status(200).json({ data: imagesPath });
    } catch (error) {
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  //ADD to favoris
  async addToFavorites(payload: any, publicationId: number) {
    const userId = payload;
    return this.prismaService.publicationFavorite.create({
      data: {
        userId,
        publicationId,
      },
    });
  }


  async getFavorites(userId: number) {
    return this.prismaService.publicationFavorite.findMany({
      where: { userId },
      include: { publication: true },
    });
  }


  async removeFromFavorites(userId: number, publicationId: number) {
    return this.prismaService.publicationFavorite.deleteMany({
      where: {
        AND: [
          { userId: userId },
          { publicationId: publicationId }
        ]
      }
    });
  }

  async getUserPublications(userId: number): Promise<Publication[]> {
    const publications = await this.prismaService.publication.findMany({
      where: { userId: userId },
      orderBy: {
        updatedAt: Prisma.SortOrder.desc // Or updatedAt, depending on your requirements
      } // assuming there's a userId field in your Publication model
    });
    if (!publications) throw new NotFoundException("Publications not found");
    return publications;
  }


  async getSubscriptionById(id: number) {
    return this.prismaService.subscription.findUnique({
      where: { ids: id },
    });
  }
  async demanderExpertise(pubId: number, userId: number, expertId: number) {
    try {
      const existingDemande = await this.prismaService.demandExpertise.findUnique({
        where: {
          expertId_userId_pubId: {
            expertId: expertId,
            userId: userId,
            pubId: pubId,
          },
        },
      });
  
      if (existingDemande) {
        throw new Error('Une demande d\'expertise existe déjà pour cette combinaison expert, user et publication.');
      }
  
      // Créer une nouvelle demande d'expertise
      const newDemande = await this.prismaService.demandExpertise.create({
        data: {
          userId: userId,
          pubId: pubId,
          expertId: expertId,
          status: 'EN_ATTENTE',

        }
      });
      // Envoyer une notification à l'expert
      const expert = await this.prismaService.expert.findUnique({ where: { ide: expertId } });
      const notificationContent = {
        pubId: pubId,
        userId: newDemande.userId, // Ajoutez userId à notificationContent
        expertId: expertId,
      };
      if (expert) {
        await this.notificationService.createNotificationToExpert(notificationContent, null);
      }
      return newDemande;
    } catch (error) {
      throw new Error(error);
    }
  }


}













/*async create(createPubDto: CreatePubDto,images: Array<Express.Multer.File>, video: Express.Multer.File) {
  const imageUrls = await Promise.all(images.map(file => this.uploadImage(file)));
  const videoUrl = await this.uploadVideo(video);
  const { marque, model, anneeFabrication, nombrePlace, couleur, kilometrage, prix, descrption, typeCarburant} = createPubDto;

  // Create a new publication in the database
  const publication = await this.prismaService.publication.create({
    data: {
      marque,
      model,
      anneeFabrication,
      nombrePlace,
      couleur,
      kilometrage,
      prix,
      descrption,
      typeCarburant,
      images: { set: imageUrls as string[] },
      video: videoUrl,
    }as any,
  });
  return publication;}

  private async uploadImage(file: Express.Multer.File): Promise<string> {
    const fileName = `${Date.now()}-${file.originalname}`;
    const imagePath = path.join(__dirname, '..', 'uploads', 'images', fileName);
 
    return new Promise((resolve, reject) => {
      fs.writeFile(imagePath, file.buffer, err => {
        if (err) {
          reject(err);
        } else {
          resolve(`/uploads/images/${fileName}`);
        }
      });
    });
  }
 
  private async uploadVideo(file: Express.Multer.File): Promise<string> {
    const fileName = `${Date.now()}-${file.originalname}`;
    const videoPath = path.join(__dirname, '..', 'uploads', 'videos', fileName);
 
    return new Promise((resolve, reject) => {
      fs.writeFile(videoPath, file.buffer, err => {
        if (err) {
          reject(err);
        } else {
          resolve(`/uploads/videos/${fileName}`);
        }
      });
    });
  }*/


/*async createPublicationWithMedia(userId: number, files: { images: Express.Multer.File[], videos: Express.Multer.File[] }, createPubDto: CreatePubDto): Promise<any> {
 
    const { images, videos } = files;
    if (!images || !videos || images.length < 4 || videos.length < 1) {
      throw new BadRequestException('Vous devez fournir au moins 4 images et une vidéo.');
    }
 
    // Enregistrer les chemins des fichiers dans la base de données
    const mediaPromises: Promise<Media>[] = [];
 
    for (const image of images) {
      const imagePath = join('uploads/images', image.filename);
      mediaPromises.push(this.prismaService.media.create({
        data: {
          filePath: imagePath,
          fileType: 'image',
          publication: { connect: { userId } }
        }
      }));
    }
 
    for (const video of videos) {
      const videoPath = join('uploads/videos', video.filename);
      mediaPromises.push(this.prismaService.media.create({
        data: {
          filePath: videoPath,
          fileType: 'video',
          publication: { connect: { userId } }
        }
      }));
    }
 
    //const mediaPromises: Promise<Media>[] = [];

    // ...
    
    const savedMediaIds = await Promise.all(mediaPromises.map(async promise => (await promise).mediaID));

    const savedMediaWhereUniqueInputs = savedMediaIds.map(mediaId => ({ mediaID: mediaId }));
    // Créer la publication
    const publication = await this.prismaService.publication.create({
      data: {
        ...createPubDto,
        userId,
        medias: {
          connect: savedMediaWhereUniqueInputs
      }
    }});
 
    return publication;
  }*/
/**
async associateMedia(publicationId: number, mediaIds: number[]): Promise<Publication> {
    try {
      const updatedPublication = await this.prismaService.publication.update({
        where: { pubid: publicationId },
        data: {
          medias: { connect: mediaIds.map(mediaId => ({ mediaID: mediaId })) },
        },
      });
      return updatedPublication;
    } catch (error) {
      throw new Error("Une erreur s'est produite lors de l'association des médias à la publication : " + error.message);
    }} */
/* async uploadImages(files: Array<Express.Multer.File>, publicationId: number): Promise<void> {
     // Vous pouvez ajouter la logique pour vérifier si la publication existe et valider l'utilisateur, si nécessaire
     return this.mediaService.createMedia(files, publicationId);
 }*/

