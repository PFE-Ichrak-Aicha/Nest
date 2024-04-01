import { Body, Controller, Req, UseGuards, Delete, Put, Post, UseInterceptors, UploadedFile, Get, Param, Res, ParseIntPipe, NotFoundException, UnauthorizedException, Query, BadRequestException } from '@nestjs/common';
import { DeleteAccountDto } from 'dto/deleteAccountDto';
import { UpdateAccountDto } from 'dto/updateAccountDto';
import { AdminUserCreateInput, UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import path, { join } from 'path';
import { Request, request } from 'express'
import { Observable, from, map, of } from 'rxjs';
import * as multer from 'multer';
import { Publication, User } from '@prisma/client';
import { UserWithoutPassword } from './user.service';
import { AdminGuard } from 'src/auth/admin.guard';

export const storage = {
    storage: multer.diskStorage({
        destination: './uploads/profileimages',
        filename: (req, file, cb) => {
            console.log('Configuration du stockage :', file);
            let splitedName = file.originalname.split('.')
            const filename: string = splitedName[0];
            const extention: string = file.mimetype.split('/')[1];;
            cb(null, `${filename}.${extention}`);
        }
    }),

}
@Controller('user')
export class UserController {
    uploadService: any;
    constructor(private readonly userService: UserService) { }
   
    @UseGuards(AuthGuard("jwt"))
    @Get(':id')
    async getUsrById(@Param('id', ParseIntPipe) userId: number): Promise<UserWithoutPassword> {
        return this.userService.getUserById(userId);
    }


    @UseGuards(AuthGuard("jwt"))
    @Delete("delete-account")
    deleteAccount(@Req() request: Request) {
        const userId = request.user["id"]
        return this.userService.deleteAccount(userId);
    }


    @UseGuards(AuthGuard("jwt"))
    @Put("update-account")
    update(@Req() request: Request,
        @Body() updateAccountDto: UpdateAccountDto,
    ) {
        const userId = request.user["id"]
        return this.userService.updateAccount(userId, updateAccountDto)
    }

    @UseGuards(AuthGuard("jwt"))
    @Post('upload')
    @UseInterceptors(FileInterceptor('file', storage))
    async uploadFile(@UploadedFile() file, @Req() request: Request): Promise<Observable<Object>> {
        const user: User = request.user as User;
        if (!user || !user.id) {
            throw new NotFoundException('Utilisateur non trouvé');
        }
        // const userId = user.id;
        const userExists = await this.userService.getUserById(user.id);
        if (!userExists) {
            throw new NotFoundException('Utilisateur non trouvé');
        }
        await this.userService.associateProfileImage(user, file.filename);
        return of({ imagePath: file.filename });
    }


    @Get('profile-image/:id')
    async findProfileImage(@Param('id', ParseIntPipe) userId: number, @Res() res): Promise<void> {
        // Récupérez le nom de l'image à partir de la base de données en fonction de l'ID de l'utilisateur
        try {
            const imageName = await this.userService.getProfileImageName(userId);
            // Envoyez le fichier correspondant en réponse
            res.sendFile(join(process.cwd(), 'uploads/profileimages/' + imageName));
        }
        catch (error) {
            if (error instanceof NotFoundException) {
                res.status(404).send(error.message);
            } else {
                res.status(500).send('Une erreur interne s\'est produite');
            }
        }
    }


    @UseGuards(AuthGuard("jwt"))
    @Put('update-profile-image')
    @UseInterceptors(FileInterceptor('file', storage))
    updateProfileImage(@UploadedFile() file, @Req() request: Request): Observable<Object> {
        const userId = request.user["id"];
        return from(this.userService.updateProfileImage(userId, file.filename));
    }

    

}
