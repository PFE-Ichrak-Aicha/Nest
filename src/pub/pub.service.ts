import { BadRequestException, ForbiddenException, Injectable, NotFoundException, Res } from '@nestjs/common';
import { Publication } from '@prisma/client';
import { CreatePubDto } from 'dto/createPubDto';
import { UpdatePubDto } from 'dto/updatePubDto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { Image } from '@prisma/client';
import { PubFilterDto } from 'dto/pubFilterDto';
import { publicationStorage } from './pub.controller';
import { join } from 'path';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { Response } from 'express'
import { createReadStream } from 'fs';
import { Equippement } from '@prisma/client';
const between = (start: number, end: number) => ({
  gte: start,
  lte: end,
});

@Injectable()
export class PubService {
  constructor(private readonly prismaService: PrismaService,) { }


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
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
  }


  async getPubById(pubId: number): Promise<Publication> {
    const publication = await this.prismaService.publication.findUnique({
      where: { pubid: pubId },
    });
    if (!publication) throw new NotFoundException("Publication not found");
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
  async create(createPubDto: CreatePubDto, payload: any,) {
    const userId = payload;
    const { marque, model, anneeFabrication, nombrePlace, couleur, kilometrage, prix, descrption, typeCarburant, city, boiteVitesse, transmission, carrassorie, sellerie ,equippements} = createPubDto;
  
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
      
        userId,
         
         
        city,
        boiteVitesse,
        transmission,
        carrassorie,
        sellerie,
        //equippements
      },
    });
  
     // Créer les relations many-to-many entre la publication et les équipements
     await this.prismaService.equippementPublication.createMany({
      data: equippements.map((equippementId) => ({
        publicationId: createdPublication.pubid,
        equippementId,
      })),
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


  async searchPublications(filterDto: PubFilterDto): Promise<Publication[]> {
    const { marque, model, anneeMin, anneeMax, nombrePlace, kilometrageMin, kilometrageMax, prixMin, prixMax, typeCarburant, couleur } = filterDto;
    const anneeMinInt = anneeMin ? parseInt(anneeMin) : undefined;
    const anneeMaxInt = anneeMax ? parseInt(anneeMax) : undefined;
    const nombreplaceInt = nombrePlace ? parseInt(nombrePlace) : undefined;
    const kilometrageMinInt = kilometrageMin || 0;
    const kilometrageMaxInt = kilometrageMax ? parseInt(kilometrageMax) : undefined
    const prixMinInt = prixMin || 0;
    const prixMaxInt = prixMax ? parseInt(prixMax) : undefined;
    const publications = await this.prismaService.publication.findMany({
      where: {
        marque: marque ? { equals: marque } : undefined,
        model: model ? { equals: model } : undefined,
        anneeFabrication: anneeMinInt && anneeMaxInt ? between(anneeMinInt, anneeMaxInt) : undefined,
        nombrePlace: nombrePlace ? { equals: nombreplaceInt } : undefined,
        kilometrage: {
          gte: Number(kilometrageMinInt),
          lte: kilometrageMaxInt,
        },
        prix: {
          gte: Number(prixMinInt),
          lte: prixMaxInt,
        },
        typeCarburant: typeCarburant ? { equals: typeCarburant } : undefined,
        couleur: couleur ? { equals: couleur } : undefined,
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    return publications;
  }


  async getAllMarques(): Promise<string[]> {
    const brands = await this.prismaService.publication.findMany({
      distinct: ['marque'],
      select: {
        marque: true,
      },
    });
    return brands.map((pub) => pub.marque);
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


  async deleteWithImages(pubid: number, userId: number) {
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
    await this.prismaService.publication.update({
      where: { pubid },
      data: {
        images: {
          deleteMany: {},
        },
      },
    });
    // delete the publication
    await this.prismaService.publication.delete({ where: { pubid } });
    return { data: "Publication and associated images deleted" };
  }


  async update(pubid: number, userId: any, updatePubDto: UpdatePubDto) {
    const publication = await this.prismaService.publication.findUnique({ where: { pubid } })
    if (!publication) throw new NotFoundException("Publication not found")
    if (publication.userId != userId) throw new ForbiddenException("Forbidden action")
    await this.prismaService.publication.update({ where: { pubid }, data: { ...updatePubDto } })
    return { data: "Publication modifiée !" }
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
        path: 'http://localhost:3000/uploads/images/${item.path}'
        // path: join(__dirname, '..', 'uploads', 'images', item.path)
      }));

      return res.status(200).json({ data: imagesPath });
    } catch (error) {
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  //ADD to favoris
  async addToFavorites(userId: number, publicationId: number) {
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

