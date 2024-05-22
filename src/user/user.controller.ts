import {
  Body,
  Controller,
  Req,
  UseGuards,
  Delete,
  Put,
  Post,
  UseInterceptors,
  UploadedFile,
  Get,
  Param,
  Res,
  ParseIntPipe,
  NotFoundException,
  Patch,
} from '@nestjs/common';
import { Socket } from 'socket.io';
import { UpdateAccountDto } from 'dto/updateAccountDto';
import { UserService } from './user.service';
import { FileInterceptor } from '@nestjs/platform-express';
import path, { join } from 'path';
import { Request, request } from 'express';
import { Observable, from, map, of } from 'rxjs';
import * as multer from 'multer';
import { UserWithoutPassword } from './user.service';
import { UserGuard } from './user.guard';
import { Notification } from '@prisma/client';
import { InscriptionDto } from 'dto/inscriptionDto';
import { DemandeDto } from 'dto/demandeDto';

interface CustomRequest extends Request {
  user: {
    id: number; // Assurez-vous que le type de ida est correct
    // Autres propriétés de l'administrateur si nécessaire
  };
}

export const storage = {
  storage: multer.diskStorage({
    destination: './uploads/profileimages',
    filename: (req, file, cb) => {
      console.log('Configuration du stockage :', file);
      let splitedName = file.originalname.split('.');
      const filename: string = splitedName[0];
      const extention: string = file.mimetype.split('/')[1];
      cb(null, `${filename}.${extention}`);
    },
  }),
};


@Controller('user')
export class UserController {
  uploadService: any;
  constructor(private readonly userService: UserService) {}


  @UseGuards(UserGuard)
  @Delete('delete-account')
  deleteAccount(@Req() request: any) {
    const payload = request.user;
    //console.log("PAYYYYYY", payload)
    const userId = payload.sub;
    return this.userService.deleteAccount(userId);
  }


  @UseGuards(UserGuard)
  @Put('update-account')
  update(
    @Req() request: any,
    @Body() updateAccountDto: UpdateAccountDto,
  ): Promise<any> {
    const payload = request.user;
    console.log('PAYYYYYY', payload);
    const userId = payload.sub;
    //const userId = request.user["id"]
    return this.userService.updateAccount(userId, updateAccountDto);
  }


  @UseGuards(UserGuard)
  @Post('upload')
  @UseInterceptors(FileInterceptor('file', storage))
  async uploadFile(
    @UploadedFile() file,
    @Req() request: any,
  ): Promise<Observable<Object>> {
    const payload = request.user;
    const userId = payload.sub;
    const userExists = await this.userService.getUserById(userId);
    if (!userExists) {
      throw new NotFoundException('Utilisateur non trouvé');
    }
    await this.userService.associateProfileImage(userId, file.filename);
    return of({ imagePath: file.filename });
  }


  @UseGuards(UserGuard)
  @Put('update-profile-image')
  @UseInterceptors(FileInterceptor('file', storage))
  updateProfileImage(
    @UploadedFile() file,
    @Req() request: any,
  ): Observable<Object> {
    const payload = request.user;
    const userId = payload.sub;
    return from(this.userService.updateProfileImage(userId, file.filename));
  }


  @UseGuards(UserGuard)
  @Get('notifications')
  async getNotifications(@Req() request: any) {
    const payload = request.user;
    const userId = payload.sub;
    return this.userService.getNotificationsByUserId(userId);
  }


  @Post('demande-creation-compte')
async demandeCreationCompte(@Body() demandeDto:DemandeDto,  @Req() req: any) {
  const client: Socket = req
  return this.userService.demandeCreationCompte(demandeDto,client);
}

  @UseGuards(UseGuards)
  @Patch('notifications/:notificationId')
  async markNotificationAsRead(
    @Param('notificationId', ParseIntPipe) notificationId: number,
  ): Promise<Notification> {
    const notification =
      await this.userService.markNotificationAsRead(notificationId);
    return notification;
  }

  @Get('profile-image/:id')
  async findProfileImage(
    @Param('id', ParseIntPipe) userId: number,
    @Res() res,
  ): Promise<void> {
    // Récupérez le nom de l'image à partir de la base de données en fonction de l'ID de l'utilisateur
    try {
      const imageName = await this.userService.getProfileImageName(userId);
      // Envoyez le fichier correspondant en réponse
      res.sendFile(join(process.cwd(), 'uploads/profileimages/' + imageName));
    } catch (error) {
      if (error instanceof NotFoundException) {
        res.status(404).send(error.message);
      } else {
        res.status(500).send("Une erreur interne s'est produite");
      }
    }
  }
  @UseGuards(UserGuard)
  @Get(':id')
  async getUsrById(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: any,
  ): Promise<UserWithoutPassword> {
    const payload = request.user;
    const userId = payload && payload.sub ? payload.sub : null;
    return this.userService.getUserById(userId);
  }
  
}
