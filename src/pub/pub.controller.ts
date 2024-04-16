import { Body, Controller, Delete, Get, HttpCode, HttpStatus, InternalServerErrorException, NotFoundException, Param, ParseIntPipe, Post, Put, Query, Req, Res, UploadedFile, UploadedFiles, UseGuards, UseInterceptors, ValidationPipe } from '@nestjs/common';
import { PubService } from './pub.service';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from 'src/user/user.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePubDto } from 'dto/createPubDto';
import { Request } from 'express';
import { UpdatePubDto } from 'dto/updatePubDto';
import { MediaService } from 'src/media/media.service';
import { Publication } from '@prisma/client';
import * as multer from 'multer';
import { FilesInterceptor } from '@nestjs/platform-express';
import { PubFilterDto } from 'dto/pubFilterDto';
import { Response } from 'express';

export const publicationStorage = {
  imageStorage: multer.diskStorage({
    destination: './uploads/images',
    filename: (req, file, cb) => {
      console.log('Configuration du stockage :', file);
      let splitedName = file.originalname.split('.')
      const filename: string = splitedName[0];
      const extention: string = file.mimetype.split('/')[1];;
      cb(null, `${filename}.${extention}`);
    }
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

function checkFileType(file, cb) {
  const filetypes = /jpg|jpeg|png/;
  const extname = filetypes.test(file.originalname.toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb('Error: Images only!');
  }
}

@Controller('pubs')
export class PubController {
  publicationService: any;
  constructor(private readonly pubService: PubService, private readonly mediaService: MediaService, private readonly userService: UserService, private readonly prismaService: PrismaService) { }

  @Get()
  getAll() {
    return this.pubService.getAll()
  }

  //bch taffichi IMAGESPAR ID de pub
  @Get(':id/images')
  async getPublicationImages(@Param('id', ParseIntPipe) id: number, @Res() res: Response) {
    let result = this.pubService.getPublicationImages(id, res);

    return result;


  }

  //FILTRER
  @Get('filtrer')
  async filterPublications(@Query(ValidationPipe) filterDto: PubFilterDto): Promise<Publication[]> {
    if (!filterDto.orderByPrice && !filterDto.orderByKilometrage) {
      return this.pubService.getAll();
    }
    return this.pubService.filterPublications(filterDto);
  }

  //Search 
  @Get('search')
  async searchPublications(@Query(ValidationPipe) filterDto: PubFilterDto): Promise<Publication[]> {
    if (!filterDto.marque && !filterDto.model && !filterDto.anneeMin && !filterDto.anneeMax && !filterDto.nombrePlace && !filterDto.kilometrageMin && !filterDto.kilometrageMax && !filterDto.prixMin && !filterDto.prixMax && filterDto.typeCarburant == null && filterDto.couleur == null) {
      return this.pubService.getAll();
    }

    return this.pubService.searchPublications(filterDto);
  }

  //yraja3lk marques li 3ana fi lbase
  @Get('marques')
  async getAllBrands(): Promise<string[]> {
    return this.pubService.getAllMarques();
  }

  //yraja3lk models li 3ana fi lbase
  @Get('models')
  async getAllModels(): Promise<string[]> {
    return this.pubService.getAllModels();
  }

  //yraja3lk couleurs li 3ana fi lbase
  @Get('couleurs')
  async getAllColors(): Promise<string[]> {
    return this.pubService.getAllColors();
  }

  //yraja3lk type de carburant li 3ana fi lbase 
  @Get('TypesCarburant')
  async getAllFuelTypes(): Promise<string[]> {
    return this.pubService.getAllTypesCarburant();
  }

  //Get PUB PAR ID
  @Get(':pubid')
  //@UseGuards(AuthGuard('jwt'))
  async getPublicationById(@Param('pubid', ParseIntPipe) pubId: number) {
    return this.pubService.getPubById(pubId);
  }

  //bch ta3mel creation d'une pub
  @Post("create")
  @UseGuards(AuthGuard("jwt"))
  create(@Body() createPubDto: CreatePubDto, @Req() request: Request) {
    const userId = request.user["id"]
    return this.pubService.create(createPubDto, userId)
  }

  //bch tuploawdi tsawer
  @Post('uploads/:pubId')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FilesInterceptor('files', 10, {
    storage: publicationStorage.imageStorage,
    fileFilter: function (req, file, cb) {
      checkFileType(file, cb);
    },
  }))
  async uploadFiles(@UploadedFiles() files: Array<Express.Multer.File>, @Param('pubId', ParseIntPipe) pubId: number) {
    try {
      console.log("debugin.............", typeof files);
      if (!files || files.length === 0) {
        console.log(files);
      }
      const publicationExists = await this.pubService.getPubById(pubId);
      if (!publicationExists) {
        throw new NotFoundException('Publication non trouvée');
      }
      const fileNames: string[] = [];
      files.forEach(file => {
        fileNames.push(file.originalname);
      });
      console.log("publication id =", pubId);
      console.log("images =", fileNames);
      const imageUrls = await this.pubService.associateImagesToPublication(pubId, fileNames);
      console.log(imageUrls);
      return imageUrls;
    } catch (err) {
      console.log("exception ===", err.message);
    }
  }

  //bch ta3mel update ll tsawer mta3 une publication
  @UseGuards(AuthGuard('jwt'))
  @Put(':pubId/images')
  @UseInterceptors(FilesInterceptor('files', 10, {
    storage: publicationStorage.imageStorage,
    fileFilter: function (req, file, cb) {
      checkFileType(file, cb);
    },
  }))
  async updatePublicationImages(
    @Param('pubId', ParseIntPipe) pubId: number,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    try {
      // Check if publication exists
      const publicationExists = await this.pubService.getPubById(pubId);
      if (!publicationExists) {
        throw new NotFoundException('Publication not found');
      }

      // Handle file upload and associate with publication
      const fileNames: string[] = files.map(file => file.filename);
      const updatedPublication = await this.pubService.updatePublicationImages(pubId, fileNames);
      return updatedPublication;
    } catch (err) {
      throw new NotFoundException(err.message);
    }
  }

  //bch tfasa5 lpub
  @UseGuards(AuthGuard("jwt"))
  @Delete("delete/:id")
  delete(@Param("id", ParseIntPipe) pubid: number, @Req() request: Request) {
    const userId = request.user["id"]
    return this.pubService.deleteWithImages(pubid, userId)
  }

  //bch ta3ml update ll info mta33 lpub
  @UseGuards(AuthGuard("jwt"))
  @Put("update/:id")
  update(@Param("id", ParseIntPipe) pubid: number,
    @Body() updatePubDto: UpdatePubDto,
    @Req() request: Request) {
    const userId = request.user["id"]
    return this.pubService.update(pubid, userId, updatePubDto)
  }

  //favoris
  @UseGuards(AuthGuard("jwt"))
  @Post(':id/favoris')
  async addToFavorites(@Req() req, @Param('id', ParseIntPipe) publicationId: number) {
    const userId = req.user.id;

    return this.pubService.addToFavorites(userId, publicationId);
  }

  //Bch tchouf biha liste de favoris mta3k
  @UseGuards(AuthGuard('jwt'))
  @Get(':id/favoris')
  async getFavorites(@Req() req, @Param('id', ParseIntPipe) publicationId: number) {
    const userId = req.user.id;

    return this.pubService.getFavorites(userId);
  }

  //tnajem tfasa5 favoris mn liste
  @UseGuards(AuthGuard('jwt'))
  @Delete(':id/remove-favoris')
  async removeFromFavorites(@Req() req, @Param('id', ParseIntPipe) publicationId: number) {
    const userId = req.user.id;

    return this.pubService.removeFromFavorites(userId, publicationId);
  }

  //Bcht chouf tous les pubs d'un utilisateur
  // @UseGuards(AuthGuard('jwt'))
  @Get("user/:userId")
  async getUserPublications(@Param('userId', ParseIntPipe) userId: number) {
    return this.pubService.getUserPublications(userId);
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