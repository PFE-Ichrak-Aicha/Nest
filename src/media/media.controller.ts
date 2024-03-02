import { BadRequestException, Body, Controller, Get, NotFoundException, Param, ParseIntPipe, Post, Req, UploadedFile, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { MediaService } from './media.service';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';

import { Publication, User } from '@prisma/client';
//import { MediaDto } from 'dto/mediaDto';
import * as multer from 'multer';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
//import { MediaWithoutFile } from './media.entity';
/*
export const storage= {
  storages: multer.diskStorage({
    // Check the file mimetype to determine if it's an image or a video
    destination: (req, file, cb) => {
      if (file.mimetype.startsWith('image/')) {
        cb(null, 'uploads/images');
      } else if (file.mimetype.startsWith('video/')) {
        cb(null, 'uploads/videos');
      } else {
        cb(new Error('Unsupported file type'), false);
      }
    },
    filename: (req, file, cb) => {
      console.log('Configuration du stockage :', file);
      let splitedName = file.originalname.split('.')
      const filename: string = splitedName[0];
      const extention: string = file.mimetype.split('/')[1];
      cb(null, `${filename}.${extention}`);
    }
  })
}

@Controller('media')
export class MediaController {
  // uploadService: any;
  constructor(private readonly mediaService: MediaService) { }
  @UseGuards(AuthGuard("jwt"))

  @Post(':publicationId')
  async createMedia(
    @Body() mediaDto: MediaDto,
    @Param('publicationId', ParseIntPipe) publicationId: number,
    @Req() req,
  ): Promise<void> {
    mediaDto.images = req.file.path;
    mediaDto.videos = req.file.path;
    mediaDto.mediaType = mediaDto.mediaType.toLowerCase() as 'image' | 'video';

    await this.mediaService.createMedia(mediaDto, publicationId);
  }



  }
  



















  
  /*private upload = multer({
    storage: this.mediaService.imageStorage,
  });

  @Post(':pubid/images')
  async addImages(
    @Param('pubid') publicationId: number,
    @GetUser() user: User,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.mediaService.addImages(user, publicationId, files);
  }
  // @UseGuards(AuthGuard( 'jwt' ) )
  /** 
  @UseGuards(AuthGuard('jwt'))
  @Post(':pubId/upload')
  @UseInterceptors(
    FileInterceptor('image', {
      dest: './uploads/images', // Emplacement de sauvegarde des images
    }),
    FileInterceptor('video', {
      dest: './uploads/videos', // Emplacement de sauvegarde des vidéos
    }),
  ) */

  /**
 async uploadMedia(
   @Param('pubId') publicationId: number,
   @UploadedFiles() mediaFiles: Array<Express.Multer.File>,
 ): Promise<Media> {
   const images = mediaFiles.find(file => file.fieldname === 'image')?.path;
   const videos = mediaFiles.find(file => file.fieldname === 'video')?.path;
   if (!images || !videos) {
     throw new BadRequestException('Image and video files are required.');
   }
   const mediaDTO: MediaDto = { images, videos };
   return this.mediaService.createMedia(publicationId, mediaDTO);
 } */

////function GetUser(): (target: MediaController, propertyKey: "addImages", parameterIndex: 1) => void {
//throw new Error('Function not implemented.');
//}

