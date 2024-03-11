import { BadRequestException, Body, Controller, Delete, Get, NotFoundException, Param, ParseIntPipe, Post, Put, Req, UploadedFile, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { PubService } from './pub.service';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from 'src/user/user.service';
import { CreatePubDto } from 'dto/createPubDto';
import { Request } from 'express';
import { UpdatePubDto } from 'dto/updatePubDto';
import { MediaService } from 'src/media/media.service';
import {  Publication, User } from '@prisma/client';
import { FileFieldsInterceptor, FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
//import { MediaDto } from 'dto/mediaDto';
//import multer, { diskStorage } from 'multer';
import * as multer from 'multer';
import { extname } from 'path';
import { Observable, of } from 'rxjs';
export const publicationStorage = {
  imageStorage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, './uploads/images');
    },
    filename: (req, file, cb) => {
      const extension = file.originalname.split('.').pop();
      const isValidExtension = ['jpg', 'jpeg', 'png', 'gif'].includes(extension.toLowerCase());

      if (!isValidExtension) {
        return (new Error('Extension de fichier invalide'));
      }

      cb(null, `${Date.now()}-${file.originalname}`);
    },
  }),
  videoStorage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, './uploads/videos');
    },
    filename: (req, file, cb) => {
      const extension = file.originalname.split('.').pop();
      const isValidExtension = ['mp4'].includes(extension.toLowerCase());

      if (!isValidExtension) {
        return (new Error('Extension de fichier invalide'));
      }

      cb(null, `${Date.now()}-${file.originalname}`);
    },
  }),
};

@Controller('pubs')
export class PubController {
  publicationService: any;
  prismaService: any;
  userService: any;
  // mediaService: any;
  constructor(private readonly pubService: PubService, private readonly mediaService: MediaService) { }
  @Get()
  getAll() {
    return this.pubService.getAll()
  }

  @Get(':pubid') @UseGuards(AuthGuard('jwt'))
  async getPublicationById(@Param('pubid', ParseIntPipe) pubId: number) {
    return this.pubService.getPubById(pubId);
  }

  /*@UseGuards(AuthGuard('jwt'))
  @Post('create')
  @UseInterceptors(
    FileInterceptor('images', { storage: publicationStorage.imageStorage }),
    FileInterceptor('video', { storage: publicationStorage.videoStorage })
  )
  async create(
    @Body() createPubDto: CreatePubDto,
    @Req() request: Request,
    @UploadedFiles() files: { images: Array<Express.Multer.File>, video?: Express.Multer.File }
  ) {
    const userId = request.user["id"];
    
    // Vous pouvez accéder aux images téléchargées via `files.images`
    // et à la vidéo via `files.video`

    return this.pubService.create(createPubDto, userId, files);
  }*/
    @UseGuards(AuthGuard("jwt"))
  @Post("create")
  create(@Body() createPubDto: CreatePubDto, @Req() request: Request) {
      const userId = request.user["id"]
      return this.pubService.create(createPubDto, userId)
  }
  async uploadFiles(@UploadedFiles() files, @Req() request: Request): Promise<Observable<Object>> {
    const user: User = request.user as User;
    if (!user || !user.id) {
        throw new NotFoundException('Utilisateur non trouvé');
    }
    const userExists = await this.userService.getUserById(user.id);
    if (!userExists) {
        throw new NotFoundException('Utilisateur non trouvé');
    }

    // Vérifier si la publication existe
    const existingPublication = await this.prismaService.publication.findFirst({ where: { userId: user.id } });
    if (!existingPublication) {
        throw new NotFoundException('Publication non trouvée');
    }

    const fileNames: string[] = [];
    files.forEach(file => {
        fileNames.push(file.filename);
    });

    // Associez les noms des fichiers à la publication
    await this.publicationService.associateImagesToPublication(user.id, fileNames);

    return of({ imagePaths: fileNames });
}

 /* @UseGuards(AuthGuard('jwt'))
  @Post(':pubid/upload')
  @UseInterceptors(
    FileInterceptor('images', { storage: publicationStorage.imageStorage }),
    FileInterceptor('video', { storage: publicationStorage.videoStorage })
  )
  async uploadFiles(
    @UploadedFiles() files: { images?: Express.Multer.File[], video?: Express.Multer.File[] },
    @Req() request: Request
  ): Promise<Observable<Object>> {
    const user: User = request.user as User;
    if (!user || !user.id) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    const pubId = parseInt(request.params.pubid); // Obtenir l'ID de la publication depuis les paramètres de la requête

    const pubExists = await this.pubService.getPubById(pubId);
    if (!pubExists) {
      throw new NotFoundException('Publication non trouvée');
    }

    if (files.images && files.images.length > 0) {
      const imageFilename = files.images[0].filename;
      await this.pubService.associateMedia(pubId, imageFilename, 'image');
      return of({ mediaPath: imageFilename });
    }

    if (files.video && files.video.length > 0) {
      const videoFilename = files.video[0].filename;
      await this.pubService.associateMedia(pubId, videoFilename, 'video');
      return of({ mediaPath: videoFilename });
    }

    throw new BadRequestException('Aucun fichier téléchargé');
  }*/
  @UseGuards(AuthGuard("jwt"))
  @Delete("delete/:id")
  delete(@Param("id", ParseIntPipe) pubid: number, @Req() request: Request) {
    const userId = request.user["id"]
    return this.pubService.delete(pubid, userId)
  }
  @UseGuards(AuthGuard("jwt"))
  @Put("update/:id")
  update(@Param("id", ParseIntPipe) pubid: number,
    @Body() updatePubDto: UpdatePubDto,
    @Req() request: Request) {
    const userId = request.user["id"]
    return this.pubService.update(pubid, userId, updatePubDto)
  }
}



















/*
@UseGuards(AuthGuard('jwt'))
@Post('create')
@UseInterceptors(
  FilesInterceptor('images', MAX_IMAGE_COUNT, multerOptions),
  FileInterceptor('video', multerOptions),
)
async uploadFiles(
@UploadedFiles() images: Array<Express.Multer.File>,
@UploadedFile() video: Express.Multer.File,
@Body() createPubDto: CreatePubDto,
) {
 

// Process imageFiles and videoFiles as needed
await this.pubService.create(createPubDto, images, video);
return { message: 'Files uploaded successfully' };
}*/
/* @UseInterceptors(FilesInterceptor('images', 4), FileInterceptor('video'))
 async createPublication(
     @UploadedFiles() files: { images: Express.Multer.File[], videos: Express.Multer.File[] },
     @Body() createPubDto: CreatePubDto, // Ajoutez le DTO pour les autres informations de la publication
     @Req() req: Request,
 ): Promise<Publication> {
   // Déclarez mediaDto avant de l'utiliser
   const userId = req.user['id']; // Supposons que vous ayez un utilisateur connecté dans le middleware
 return this.pubService.createPublicationWithMedia(userId, files, createPubDto);
 }*/
/*@UseInterceptors(
    FileFieldsInterceptor([
      { name: 'images', maxCount: 10 },
      { name: 'videos', maxCount: 10 },
    ], {
      storage: diskStorage({
        destination: './uploads/images',
        filename: (req, file, cb) => {
          cb(null, `${file.fieldname}-${Date.now()}.${file.mimetype.split('/')[1]}`);
        }
      })
    })
  )
  async create(
    @Body() createPubDto: CreatePubDto,
    @UploadedFiles() files: { images: Express.Multer.File[]; videos: Express.Multer.File[] },
    @Req() req,
  ): Promise<void> {
    const media: MediaDto[] = [];
 
    files.images.forEach((image) => {
      media.push({
        mediaType: 'image',
        url: `/uploads/images/${image.filename}`,
      });
    });
 
    files.videos.forEach((video) => {
      media.push({
        mediaType: 'video',
        url: `/uploads/videos/${video.filename}`,
      });
    });
 
    createPubDto.media = media;
    createPubDto.userId = req.user.id;
 
    await this.pubService.create(createPubDto,media);
  }*/

/*async createPublication(
    @Body() createPubDto: CreatePubDto,
    @Req() req: Request,
): Promise<string> {
    try {
        const userId = req.user['id']; // Suppose que les informations de l'utilisateur sont dans req.user
        const result = await this.pubService.createPublication(userId, createPubDto);
        return result;
    } catch (error) {
        throw new Error('Une erreur est survenue lors de la création de la publication : ' + error.message);
    }*/

/*@UseGuards(AuthGuard('jwt'))
   @Post(':pubid/media')
   @UseInterceptors(FileInterceptor('files'))
   async uploadMediaFiles(
       @UploadedFiles() files: Array<Express.Multer.File>,
       @Param('pubid', ParseIntPipe) publicationId: number
   ) {
       // Vous pouvez également ajouter la logique pour valider l'existence de la publication, si nécessaire
       return this.mediaService.createMedia(files, publicationId);
   }
   /** 
   @UseGuards(AuthGuard("jwt"))
   @Post(':pubId/media/upload')
   @UseInterceptors(
       FileInterceptor('image', {
           dest: './uploads/images', // Emplacement de sauvegarde des images
       }),
       FileInterceptor('video', {
           dest: './uploads/videos', // Emplacement de sauvegarde des vidéos
       }),
   )
   async uploadMedia(
       @Param('pubId') publicationId: number,
       @UploadedFiles() mediaFiles: Array<Express.Multer.File>,
   ): Promise<Media> {
       const images = mediaFiles.find(file => file.fieldname === 'image');
       const videos = mediaFiles.find(file => file.fieldname === 'video');
       if (!images || !videos) {
           throw new BadRequestException('Image and video files are required.');
       }
       const mediaDto: MediaDto = {
           images: images.path,
           videos: videos.path,
         };
       return this.mediaService.createMedia(publicationId, mediaDto);
   }*/
//const MAX_IMAGE_COUNT = 4;
//const MAX_VIDEO_COUNT = 1;

/*export const multerOptions = {
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'video/mp4'];
    if (!allowedMimes.includes(file.mimetype)) {
      return cb(new BadRequestException('Invalid file type'), false);
    }
    cb(null, true);
  },
  limits: {
    files: MAX_IMAGE_COUNT + MAX_VIDEO_COUNT,
    fileSize: 5 * 1024 * 1024, // 5MB max file size
  },
  storage: diskStorage({
    destination: (req, file, cb) => {
      cb(null, './uploads');
    },
    filename: (req, file, cb) => {
      const randomName = Array(32)
        .fill(null)
        .map(() => Math.round(Math.random() * 16).toString(16))
        .join('');
      cb(null, `${randomName}${extname(file.originalname)}`);
    },
  }),
};*/