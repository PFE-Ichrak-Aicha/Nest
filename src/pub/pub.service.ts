import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Publication , Image } from '@prisma/client';
import { CreatePubDto } from 'dto/createPubDto';
import { UpdatePubDto } from 'dto/updatePubDto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { UserService } from 'src/user/user.service';
import { MediaService } from 'src/media/media.service';
//import { MediaDto } from 'dto/mediaDto';
//import path, { join } from 'path';
import { unlink } from 'fs/promises';
import * as fs from 'fs';
import * as path from 'path';
import { PubFilterDto } from 'dto/pubFilterDto';
import multer from 'multer';
import { publicationStorage } from './pub.controller';
const between = (start: number, end: number) => ({
  gte: start,
  lte: end,
});
@Injectable()
export class PubService {
  constructor(private readonly prismaService: PrismaService, private mediaService: MediaService,) { }
 
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

  /*async create(createPubDto: CreatePubDto, userId: number, files: { images: Express.Multer.File[], video?: Express.Multer.File }) {
    const { marque, model, anneeFabrication, nombrePlace, couleur, kilometrage, prix, descrption, typeCarburant } = createPubDto;
    
    const imageCreateInputs = files.images.map(image => ({
      url: image.path // La propriété `url` est nécessaire dans le schéma Prisma
    }));
    const videoPath = files.video ? files.video[0].path : null;

    await this.prismaService.publication.create({
      data: {
        marque, model, anneeFabrication, nombrePlace, couleur, kilometrage, prix, descrption, typeCarburant, 
        images: { create: imageCreateInputs },
        video: videoPath ? { create: { url: videoPath } } : undefined
      },
    });

    return { message: 'Publication créée avec succès' };
  }/*



  /*async associateMedia(pubId: number, fileName: string, mediaType: 'image' | 'video') {
    try {
      if (mediaType === 'image') {
        await this.prismaService.publication.update({
          where: { pubid: pubId },
          data: {
            images: {
              create: {
                imageFileName: fileName,
              },
            },
          },
        });
      } else if (mediaType === 'video') {
        await this.prismaService.publication.update({
          where: { pubid: pubId },
          data: {
            video: {
              create: {
                videoFileName: fileName,
              },
            },
          },
        });
      }
    } catch (error) {
      throw new Error("Failed to associate media with publication");
    }
}*/
  async create(createPubDto: CreatePubDto, userId: number) {
    const { marque, model, anneeFabrication, nombrePlace, couleur, kilometrage, prix, descrption, typeCarburant } = createPubDto;

    await this.prismaService.publication.create({
      data: {
        marque, model, anneeFabrication, nombrePlace, couleur, kilometrage, prix, descrption, typeCarburant, userId,
      },
    });

    return { data: " Publication créée " };
  }
  async associateImagesToPublication(pubId: number, fileNames: string[]): Promise<Publication> {
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
  
    return this.prismaService.publication.update({
      where: { pubid: pubId },
      data: {
        images: {
          connect: images.map((image) => ({ id: image.id })),
        },
      },
    });
  }
  async searchPublications(filterDto: PubFilterDto): Promise<Publication[]> {
    const { marque, model, anneeMin, anneeMax, nombrePlace, kilometrageMin, kilometrageMax, prixMin, prixMax, typeCarburant, couleur } = filterDto;
  
    const publications = await this.prismaService.publication.findMany({
      where: {
        marque: marque ? { equals: marque } : undefined,
        model: model ? { equals: model } : undefined,
        anneeFabrication: anneeMin && anneeMax ? { gte: anneeMin, lte: anneeMax } : undefined,
        nombrePlace: nombrePlace ? { equals: nombrePlace } : undefined,
        kilometrage: kilometrageMin && kilometrageMax ? { gte: kilometrageMin, lte: kilometrageMax } : undefined,
        prix: prixMin && prixMax ? { gte: prixMin, lte: prixMax } : undefined,
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
    return
     colors.map((pub) => pub.couleur);
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
  /*async searchPublications(filterDto: PubFilterDto): Promise<Publication[]> {
   const { marque, model, anneeMin, anneeMax, nombrePlace, kilometrageMin, kilometrageMax, prixMin, prixMax, typeCarburant } = filterDto;
    
    const publications = await this.prismaService.publication.findMany({
      where: {
        marque: marque ? { equals: marque } : undefined,
        model: model ? { equals: model } : undefined,
        anneeFabrication: {
          gte: anneeMin,
          lte: anneeMax,
        },
        nombrePlace: nombrePlace ? { equals: nombrePlace } : undefined,
        kilometrage: {
          gte: kilometrageMin,
          lte: kilometrageMax,
        },
        prix: {
          gte: prixMin,
          lte: prixMax,
        },
        typeCarburant: typeCarburant ? { equals: typeCarburant } : undefined,
      },
    });

    return publications;
  }*/
  /*async associateImagesToPublication(pubId: number, imagePaths: string[]): Promise<void> {
    // Recherche de la publication associée à l'utilisateur
    const existingPublication = await this.prismaService.publication.findUnique({ where: { pubid: pubId} });

    // Vérifier si la publication existe
    if (!existingPublication) {
        throw new NotFoundException('Publication non trouvée');
    }

   const imageIds: number[] = imagePaths.map(path => parseInt(path, 10));

    await this.prismaService.publication.update({
      where: { pubid : pubId  },
      data: {  images: {
        connect: imageIds.map(imageId => ({ id: imageId })),
      } }
  });
}*/

  /*async associateImagesToPublication(userId: number, imagePaths: string[]): Promise<void> { 
    const existingPublication = await this.prismaService.publication.findFirst({ where: { userId: userId } });
    if (!existingPublication) {
        throw new NotFoundException('Publication non trouvée');
    }
   const imageIds: number[] = imagePaths.map(path => parseInt(path, 10));
    await this.prismaService.publication.update({
      where: { pubid : existingPublication.pubid  },
      data: {  images: {
        set: imageIds.map(id => ({ id }))
      } }
  });
}*/
  async delete(pubid: number, userId: number) {
    const publication = await this.prismaService.publication.findUnique({ where: { pubid } })
    if (!publication) throw new NotFoundException("Publication not found")
    // vérification de l'utilisateur qui essaie de supprimer la publication
    if (publication.userId != userId) throw new ForbiddenException("Forbidden action")
    await this.prismaService.publication.delete({ where: { pubid } })
    return { data: "Publication supprimée" }
  }
  async update(pubid: number, userId: any, updatePubDto: UpdatePubDto) {
    const publication = await this.prismaService.publication.findUnique({ where: { pubid } })
    if (!publication) throw new NotFoundException("Publication not found")
    if (publication.userId != userId) throw new ForbiddenException("Forbidden action")
    await this.prismaService.publication.update({ where: { pubid }, data: { ...updatePubDto } })
    return { data: "Publication modifiée !" }
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

