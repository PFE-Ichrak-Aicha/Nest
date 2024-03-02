import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import path from 'path';
import * as fs from 'fs';
import { PrismaService } from 'src/prisma/prisma.service';
//import { MediaDto } from 'dto/mediaDto';
import { Publication } from '@prisma/client';
import { diskStorage } from 'multer';

@Injectable()
export class MediaService {
  constructor(private readonly prismaService: PrismaService) { }

  /*async createMedia(mediaDto: MediaDto, publicationId: number): Promise<void> {
    const media = await this.prismaService.media.create({
      data: {
        publication: {
          connect: {
            pubid: publicationId,
          },
        },
        mediaType: mediaDto.mediaType,
        images: mediaDto.images,
        videos: mediaDto.videos,
      },
    });
  }

  /*private imageStorage = diskStorage({
    destination: './uploads/images',
    filename: (req, file, cb) => {
      cb(null, `${uuidv4()}-${file.originalname}`);
    },
  });
  
  async addImages(userId: number, publicationId: number, files: Express.Multer.File[]) {
    const publication = await this.prismaService.publication.findUnique({
      where: { pubid: publicationId },
    });
 
    if (!publication) {
      throw new NotFoundException('Publication not found');
    }
 
    const newImages = files.map((file) => {
      return {
        images: file.filename,
        pubId: publicationId,
      };
    });
 
    await this.prismaService.media.createMany({
      data: newImages,
    });
 
    return this.prismaService.publication.update({
      where: { pubid: publicationId },
      data: {
        medias: {
          connectOrCreate: newImages,
        },
      },
    });
  }
 
}

function uuidv4() {
throw new Error('Function not implemented.');
}
//function uuidv4() {
// throw new Error('Function not implemented.');
//}*/
}

//function uuidv4() {
  //throw new Error('Function not implemented.');
//}

